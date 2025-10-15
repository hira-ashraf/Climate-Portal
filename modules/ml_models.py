import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
import pickle
import os

class ClimateForecaster:
    def __init__(self):
        self.models = {}
        self.model_dir = 'data/models'
        os.makedirs(self.model_dir, exist_ok=True)
    
    def prepare_features(self, timeseries_data):
        if len(timeseries_data) < 12:
            return None, None
        
        values = [d['value'] for d in timeseries_data if d['value'] is not None]
        dates = [datetime.strptime(d['date'], '%Y-%m-%d') for d in timeseries_data]
        
        X = []
        y = []
        
        for i in range(6, len(values)):
            lag_1 = values[i-1]
            lag_3 = values[i-3] if i >= 3 else values[0]
            lag_6 = values[i-6] if i >= 6 else values[0]
            month = dates[i].month
            
            X.append([lag_1, lag_3, lag_6, month])
            y.append(values[i])
        
        return np.array(X), np.array(y)
    
    def train_model(self, variable, timeseries_data):
        X, y = self.prepare_features(timeseries_data)
        
        if X is None or len(X) < 10:
            return None
        
        model = RandomForestRegressor(
            n_estimators=50,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        
        model.fit(X, y)
        
        self.models[variable] = model
        
        model_path = os.path.join(self.model_dir, f'{variable}_model.pkl')
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)
        
        return model
    
    def load_model(self, variable):
        if variable in self.models:
            return self.models[variable]
        
        model_path = os.path.join(self.model_dir, f'{variable}_model.pkl')
        
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
                self.models[variable] = model
                return model
        
        return None
    
    def predict_future(self, variable, historical_data, months_ahead=3):
        model = self.load_model(variable)
        
        if model is None:
            model = self.train_model(variable, historical_data)
        
        if model is None:
            return self.generate_climatological_forecast(variable, historical_data, months_ahead)
        
        values = [d['value'] for d in historical_data if d['value'] is not None]
        last_date = datetime.strptime(historical_data[-1]['date'], '%Y-%m-%d')
        
        forecasts = []
        current_values = values[-6:]
        
        for i in range(months_ahead):
            next_date = last_date + timedelta(days=30 * (i + 1))
            next_month = next_date.month
            
            features = [
                current_values[-1],
                current_values[-3] if len(current_values) >= 3 else current_values[0],
                current_values[-6] if len(current_values) >= 6 else current_values[0],
                next_month
            ]
            
            prediction = model.predict([features])[0]
            
            trees_predictions = [tree.predict([features])[0] for tree in model.estimators_]
            std = np.std(trees_predictions)
            
            forecasts.append({
                'date': next_date.strftime('%Y-%m-%d'),
                'value': round(prediction, 2),
                'lower_bound': round(prediction - 1.96 * std, 2),
                'upper_bound': round(prediction + 1.96 * std, 2)
            })
            
            current_values.append(prediction)
            current_values = current_values[-6:]
        
        return forecasts
    
    def generate_climatological_forecast(self, variable, historical_data, months_ahead=3):
        values = [d['value'] for d in historical_data if d['value'] is not None]
        last_date = datetime.strptime(historical_data[-1]['date'], '%Y-%m-%d')
        
        monthly_means = {}
        for data_point in historical_data:
            if data_point['value'] is not None:
                month = datetime.strptime(data_point['date'], '%Y-%m-%d').month
                if month not in monthly_means:
                    monthly_means[month] = []
                monthly_means[month].append(data_point['value'])
        
        for month in monthly_means:
            monthly_means[month] = np.mean(monthly_means[month])
        
        overall_mean = np.mean(values)
        overall_std = np.std(values)
        
        forecasts = []
        for i in range(months_ahead):
            next_date = last_date + timedelta(days=30 * (i + 1))
            next_month = next_date.month
            
            predicted_value = monthly_means.get(next_month, overall_mean)
            
            forecasts.append({
                'date': next_date.strftime('%Y-%m-%d'),
                'value': round(predicted_value, 2),
                'lower_bound': round(predicted_value - 1.96 * overall_std, 2),
                'upper_bound': round(predicted_value + 1.96 * overall_std, 2)
            })
        
        return forecasts
    
    def get_model_info(self, variable):
        model = self.models.get(variable)
        
        if model is None:
            return {
                'model_type': 'Climatological Mean',
                'trained': False,
                'description': 'Using historical monthly averages for prediction'
            }
        
        return {
            'model_type': 'Random Forest Regressor',
            'trained': True,
            'n_estimators': model.n_estimators,
            'max_depth': model.max_depth,
            'features': ['lag_1_month', 'lag_3_month', 'lag_6_month', 'month_of_year'],
            'description': 'ML model trained on historical climate patterns'
        }
