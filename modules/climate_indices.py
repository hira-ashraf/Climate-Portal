"""
Climate indices calculator for heat stress, drought, and extreme events
Based on internationally standardized definitions (WMO, NOAA, etc.)
"""
import numpy as np
import pandas as pd
from scipy import stats
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta


class HeatStressCalculator:
    """Calculate heat stress indices"""
    
    @staticmethod
    def heat_index(temperature_c: float, relative_humidity: float) -> float:
        """
        Calculate Heat Index (apparent temperature)
        Based on NOAA's Heat Index equation
        
        Args:
            temperature_c: Air temperature in Celsius
            relative_humidity: Relative humidity in percent (0-100)
        
        Returns:
            Heat index in Celsius
        """
        # Convert to Fahrenheit for calculation
        T = temperature_c * 9/5 + 32
        RH = relative_humidity
        
        # Simple formula for lower temperatures
        if T < 80:
            HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (RH * 0.094))
        else:
            # Rothfusz regression
            HI = (-42.379 + 2.04901523 * T + 10.14333127 * RH 
                  - 0.22475541 * T * RH - 0.00683783 * T * T 
                  - 0.05481717 * RH * RH + 0.00122874 * T * T * RH 
                  + 0.00085282 * T * RH * RH - 0.00000199 * T * T * RH * RH)
            
            # Adjustments
            if RH < 13 and 80 <= T <= 112:
                adjustment = ((13 - RH) / 4) * np.sqrt((17 - abs(T - 95)) / 17)
                HI -= adjustment
            elif RH > 85 and 80 <= T <= 87:
                adjustment = ((RH - 85) / 10) * ((87 - T) / 5)
                HI += adjustment
        
        # Convert back to Celsius
        return (HI - 32) * 5/9
    
    @staticmethod
    def wet_bulb_globe_temperature(temperature_c: float, relative_humidity: float, 
                                   wind_speed_ms: float = 1.0, solar_radiation_wm2: float = 600) -> float:
        """
        Calculate Wet Bulb Globe Temperature (WBGT) for outdoor workers
        Simplified Liljegren model
        
        Args:
            temperature_c: Air temperature in Celsius
            relative_humidity: Relative humidity in percent
            wind_speed_ms: Wind speed in m/s
            solar_radiation_wm2: Solar radiation in W/m²
        
        Returns:
            WBGT in Celsius
        """
        # Calculate wet bulb temperature (simplified)
        wet_bulb = temperature_c * np.arctan(0.151977 * (relative_humidity + 8.313659)**0.5) + \
                   np.arctan(temperature_c + relative_humidity) - \
                   np.arctan(relative_humidity - 1.676331) + \
                   0.00391838 * (relative_humidity)**1.5 * np.arctan(0.023101 * relative_humidity) - 4.686035
        
        # Globe temperature approximation
        globe = temperature_c + 0.00184 * solar_radiation_wm2
        
        # WBGT for outdoor with sun exposure
        # WBGT = 0.7*Twb + 0.2*Tg + 0.1*Ta
        wbgt = 0.7 * wet_bulb + 0.2 * globe + 0.1 * temperature_c
        
        return wbgt
    
    @staticmethod
    def humidex(temperature_c: float, dewpoint_c: float) -> float:
        """
        Calculate Humidex (Canadian heat index)
        
        Args:
            temperature_c: Air temperature in Celsius
            dewpoint_c: Dewpoint temperature in Celsius
        
        Returns:
            Humidex value
        """
        # Calculate vapor pressure
        e = 6.11 * np.exp(5417.7530 * ((1/273.16) - (1/(dewpoint_c + 273.15))))
        
        # Calculate humidex
        h = 0.5555 * (e - 10.0)
        humidex = temperature_c + h
        
        return humidex
    
    @staticmethod
    def classify_heat_stress(heat_index_c: float) -> Dict[str, str]:
        """
        Classify heat stress level based on heat index
        Based on NOAA guidelines
        """
        if heat_index_c < 27:
            return {'level': 'normal', 'caution': 'No heat stress'}
        elif 27 <= heat_index_c < 32:
            return {'level': 'caution', 'caution': 'Fatigue possible with prolonged exposure'}
        elif 32 <= heat_index_c < 41:
            return {'level': 'extreme_caution', 'caution': 'Heat cramps and heat exhaustion possible'}
        elif 41 <= heat_index_c < 54:
            return {'level': 'danger', 'caution': 'Heat exhaustion likely, heat stroke possible'}
        else:
            return {'level': 'extreme_danger', 'caution': 'Heat stroke highly likely'}


class DroughtIndicator:
    """Calculate drought indicators"""
    
    @staticmethod
    def standardized_precipitation_index(precipitation: np.ndarray, 
                                        timescale: int = 3) -> np.ndarray:
        """
        Calculate Standardized Precipitation Index (SPI)
        
        Args:
            precipitation: Array of precipitation values
            timescale: Accumulation period in months (1, 3, 6, 12, 24)
        
        Returns:
            SPI values
        """
        # Calculate rolling sum
        if len(precipitation) < timescale:
            return np.full(len(precipitation), np.nan)
        
        accumulated = pd.Series(precipitation).rolling(window=timescale).sum().values
        
        # Fit gamma distribution to non-zero values
        non_zero = accumulated[~np.isnan(accumulated) & (accumulated > 0)]
        
        if len(non_zero) < 10:
            return np.full(len(precipitation), np.nan)
        
        # Fit gamma distribution
        try:
            shape, loc, scale = stats.gamma.fit(non_zero, floc=0)
            
            # Calculate cumulative probabilities
            cdf = stats.gamma.cdf(accumulated, shape, loc, scale)
            
            # Transform to standard normal
            spi = stats.norm.ppf(cdf)
            
            # Handle edge cases
            spi[cdf <= 0] = -3
            spi[cdf >= 1] = 3
            
            return spi
        except:
            return np.full(len(precipitation), np.nan)
    
    @staticmethod
    def standardized_precipitation_evapotranspiration_index(
        precipitation: np.ndarray,
        evapotranspiration: np.ndarray,
        timescale: int = 3
    ) -> np.ndarray:
        """
        Calculate Standardized Precipitation-Evapotranspiration Index (SPEI)
        
        Args:
            precipitation: Array of precipitation values
            evapotranspiration: Array of potential evapotranspiration values
            timescale: Accumulation period in months
        
        Returns:
            SPEI values
        """
        # Calculate water balance
        water_balance = precipitation - evapotranspiration
        
        # Use similar approach as SPI but with water balance
        if len(water_balance) < timescale:
            return np.full(len(precipitation), np.nan)
        
        accumulated = pd.Series(water_balance).rolling(window=timescale).sum().values
        
        # Fit log-logistic distribution
        try:
            # Standardize
            mean = np.nanmean(accumulated)
            std = np.nanstd(accumulated)
            
            if std == 0:
                return np.full(len(precipitation), 0)
            
            spei = (accumulated - mean) / std
            
            # Clip to reasonable range
            spei = np.clip(spei, -3, 3)
            
            return spei
        except:
            return np.full(len(precipitation), np.nan)
    
    @staticmethod
    def palmer_drought_severity_index(
        temperature: np.ndarray,
        precipitation: np.ndarray,
        available_water_capacity: float = 100.0
    ) -> np.ndarray:
        """
        Calculate Palmer Drought Severity Index (PDSI)
        Simplified version
        
        Args:
            temperature: Monthly temperature in Celsius
            precipitation: Monthly precipitation in mm
            available_water_capacity: Soil available water capacity in mm
        
        Returns:
            PDSI values
        """
        n = len(precipitation)
        pdsi = np.zeros(n)
        
        if n < 12:
            return np.full(n, np.nan)
        
        # Simplified PDSI calculation
        # Calculate potential evapotranspiration (Thornthwaite method)
        pet = np.zeros(n)
        for i in range(n):
            if temperature[i] > 0:
                pet[i] = 16 * (10 * temperature[i] / np.mean(temperature[temperature > 0])) ** 1.5
            else:
                pet[i] = 0
        
        # Calculate moisture anomaly
        d = precipitation - pet
        
        # Calculate Z-index (moisture anomaly index)
        z = np.zeros(n)
        for i in range(n):
            if i > 0:
                z[i] = 0.897 * z[i-1] + d[i] / 25.0
            else:
                z[i] = d[i] / 25.0
        
        # Convert to PDSI scale
        for i in range(n):
            if i > 0:
                pdsi[i] = 0.897 * pdsi[i-1] + z[i] / 3.0
            else:
                pdsi[i] = z[i] / 3.0
        
        return pdsi
    
    @staticmethod
    def classify_drought(index_value: float, index_type: str = 'spi') -> Dict[str, str]:
        """
        Classify drought severity based on index value
        """
        if index_value >= 2.0:
            return {'category': 'extremely_wet', 'severity': 'none'}
        elif 1.5 <= index_value < 2.0:
            return {'category': 'very_wet', 'severity': 'none'}
        elif 1.0 <= index_value < 1.5:
            return {'category': 'moderately_wet', 'severity': 'none'}
        elif -1.0 <= index_value < 1.0:
            return {'category': 'normal', 'severity': 'none'}
        elif -1.5 <= index_value < -1.0:
            return {'category': 'moderate_drought', 'severity': 'moderate'}
        elif -2.0 <= index_value < -1.5:
            return {'category': 'severe_drought', 'severity': 'severe'}
        else:
            return {'category': 'extreme_drought', 'severity': 'extreme'}


class ExtremeEventAnalyzer:
    """Analyze extreme weather events and statistics"""
    
    @staticmethod
    def hot_days(temperature: np.ndarray, threshold: float) -> int:
        """Count days exceeding temperature threshold"""
        return int(np.sum(temperature > threshold))
    
    @staticmethod
    def cold_days(temperature: np.ndarray, threshold: float) -> int:
        """Count days below temperature threshold"""
        return int(np.sum(temperature < threshold))
    
    @staticmethod
    def heavy_precipitation_days(precipitation: np.ndarray, threshold: float) -> int:
        """Count days exceeding precipitation threshold"""
        return int(np.sum(precipitation > threshold))
    
    @staticmethod
    def strong_wind_days(wind_speed: np.ndarray, threshold: float) -> int:
        """Count days exceeding wind speed threshold"""
        return int(np.sum(wind_speed > threshold))
    
    @staticmethod
    def calculate_return_periods(values: np.ndarray, 
                                 return_periods: List[int]) -> Dict[str, float]:
        """
        Calculate return period values using Gumbel distribution
        
        Args:
            values: Array of extreme values
            return_periods: List of return periods in years
        
        Returns:
            Dictionary with return period values
        """
        from scipy import stats
        
        # Fit Gumbel distribution
        params = stats.gumbel_r.fit(values)
        
        result = {}
        for period in return_periods:
            # Calculate value for given return period
            prob = 1 - (1 / period)
            value = stats.gumbel_r.ppf(prob, *params)
            result[f"{period}_year"] = round(float(value), 2)
        
        return result
    
    @staticmethod
    def identify_heatwave(temperature: np.ndarray, dates: List[datetime],
                         threshold_percentile: float = 90,
                         min_duration: int = 3) -> List[Dict]:
        """
        Identify heatwave events
        
        Args:
            temperature: Daily temperature values
            dates: Corresponding dates
            threshold_percentile: Percentile for extreme heat (default 90th)
            min_duration: Minimum consecutive days (default 3)
        
        Returns:
            List of heatwave events with start, end, duration, peak
        """
        threshold = np.percentile(temperature, threshold_percentile)
        
        heatwaves = []
        in_heatwave = False
        start_idx = 0
        
        for i, temp in enumerate(temperature):
            if temp > threshold:
                if not in_heatwave:
                    in_heatwave = True
                    start_idx = i
            else:
                if in_heatwave:
                    duration = i - start_idx
                    if duration >= min_duration:
                        event_temps = temperature[start_idx:i]
                        heatwaves.append({
                            'start_date': dates[start_idx],
                            'end_date': dates[i-1],
                            'duration_days': duration,
                            'peak_value': float(np.max(event_temps)),
                            'mean_value': float(np.mean(event_temps)),
                            'event_type': 'heatwave'
                        })
                    in_heatwave = False
        
        return heatwaves
    
    @staticmethod
    def identify_drought_events(spi: np.ndarray, dates: List[datetime],
                               threshold: float = -1.0,
                               min_duration: int = 2) -> List[Dict]:
        """
        Identify drought events based on SPI
        """
        droughts = []
        in_drought = False
        start_idx = 0
        
        for i, value in enumerate(spi):
            if not np.isnan(value) and value < threshold:
                if not in_drought:
                    in_drought = True
                    start_idx = i
            else:
                if in_drought:
                    duration = i - start_idx
                    if duration >= min_duration:
                        event_values = spi[start_idx:i]
                        droughts.append({
                            'start_date': dates[start_idx],
                            'end_date': dates[i-1],
                            'duration_months': duration,
                            'peak_value': float(np.min(event_values)),
                            'mean_value': float(np.mean(event_values)),
                            'event_type': 'drought'
                        })
                    in_drought = False
        
        return droughts
    
    @staticmethod
    def calculate_return_period(values: np.ndarray, threshold: float) -> float:
        """
        Calculate return period for exceeding a threshold
        
        Args:
            values: Historical data values
            threshold: Threshold value
        
        Returns:
            Return period in years (1/probability)
        """
        exceedances = np.sum(values > threshold)
        total = len(values)
        
        if exceedances == 0:
            return np.inf
        
        probability = exceedances / total
        return 1.0 / probability
    
    @staticmethod
    def extreme_percentiles(values: np.ndarray) -> Dict[str, float]:
        """
        Calculate extreme percentiles for return period analysis
        """
        percentiles = [50, 75, 90, 95, 99, 99.5]
        results = {}
        
        for p in percentiles:
            results[f'p{p}'] = float(np.percentile(values, p))
        
        return results

