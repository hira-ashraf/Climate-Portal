let map;
let geojsonLayer;

function initMap() {
    map = L.map('map').setView([30.3753, 69.3451], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    updateMapData();
}

function getColor(value, variable) {
    const ranges = {
        'temperature': [
            { max: 10, color: '#0571b0' },
            { max: 15, color: '#92c5de' },
            { max: 20, color: '#f7f7f7' },
            { max: 25, color: '#f4a582' },
            { max: 30, color: '#ca0020' },
            { max: Infinity, color: '#67001f' }
        ],
        'precipitation': [
            { max: 20, color: '#ffffcc' },
            { max: 50, color: '#c7e9b4' },
            { max: 100, color: '#7fcdbb' },
            { max: 150, color: '#41b6c4' },
            { max: 200, color: '#2c7fb8' },
            { max: Infinity, color: '#253494' }
        ],
        'humidity': [
            { max: 30, color: '#fff7bc' },
            { max: 45, color: '#fee391' },
            { max: 60, color: '#fec44f' },
            { max: 75, color: '#fe9929' },
            { max: 90, color: '#d95f0e' },
            { max: Infinity, color: '#993404' }
        ],
        'wind_speed': [
            { max: 3, color: '#edf8e9' },
            { max: 6, color: '#bae4b3' },
            { max: 9, color: '#74c476' },
            { max: 12, color: '#31a354' },
            { max: 15, color: '#006d2c' },
            { max: Infinity, color: '#00441b' }
        ]
    };
    
    const colorRange = ranges[variable] || ranges['temperature'];
    
    for (let i = 0; i < colorRange.length; i++) {
        if (value <= colorRange[i].max) {
            return colorRange[i].color;
        }
    }
    
    return '#gray';
}

function style(feature) {
    const variable = feature.properties.climate_variable || 'temperature';
    const value = feature.properties.climate_value;
    
    return {
        fillColor: value !== null && value !== undefined ? getColor(value, variable) : '#gray',
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    const layer = e.target;
    
    layer.setStyle({
        weight: 3,
        color: '#0891b2',
        fillOpacity: 0.9
    });
    
    layer.bringToFront();
}

function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
    const props = feature.properties;
    const value = props.climate_value !== null && props.climate_value !== undefined 
        ? props.climate_value.toFixed(2) 
        : 'N/A';
    const unit = getUnit(props.climate_variable);
    
    layer.bindPopup(`
        <strong>${props.name}</strong><br>
        ${props.climate_variable}: ${value} ${unit}
    `);
    
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

function getUnit(variable) {
    const units = {
        'temperature': '°C',
        'precipitation': 'mm',
        'humidity': '%',
        'wind_speed': 'm/s'
    };
    return units[variable] || '';
}

function updateLegend(variable) {
    const legendDiv = document.getElementById('legend');
    
    const legends = {
        'temperature': [
            { label: '< 10°C', color: '#0571b0' },
            { label: '10-15°C', color: '#92c5de' },
            { label: '15-20°C', color: '#f7f7f7' },
            { label: '20-25°C', color: '#f4a582' },
            { label: '25-30°C', color: '#ca0020' },
            { label: '> 30°C', color: '#67001f' }
        ],
        'precipitation': [
            { label: '< 20mm', color: '#ffffcc' },
            { label: '20-50mm', color: '#c7e9b4' },
            { label: '50-100mm', color: '#7fcdbb' },
            { label: '100-150mm', color: '#41b6c4' },
            { label: '150-200mm', color: '#2c7fb8' },
            { label: '> 200mm', color: '#253494' }
        ],
        'humidity': [
            { label: '< 30%', color: '#fff7bc' },
            { label: '30-45%', color: '#fee391' },
            { label: '45-60%', color: '#fec44f' },
            { label: '60-75%', color: '#fe9929' },
            { label: '75-90%', color: '#d95f0e' },
            { label: '> 90%', color: '#993404' }
        ],
        'wind_speed': [
            { label: '< 3 m/s', color: '#edf8e9' },
            { label: '3-6 m/s', color: '#bae4b3' },
            { label: '6-9 m/s', color: '#74c476' },
            { label: '9-12 m/s', color: '#31a354' },
            { label: '12-15 m/s', color: '#006d2c' },
            { label: '> 15 m/s', color: '#00441b' }
        ]
    };
    
    const legendItems = legends[variable] || legends['temperature'];
    
    legendDiv.innerHTML = legendItems.map(item => `
        <div class="legend-item">
            <div class="legend-color" style="background-color: ${item.color}"></div>
            <span>${item.label}</span>
        </div>
    `).join('');
}

async function updateMapData() {
    const variable = document.getElementById('variableSelect').value;
    const date = document.getElementById('dateSelect').value;
    
    try {
        const response = await fetch(`/api/map-data?variable=${variable}&date=${date}&level=1`);
        const data = await response.json();
        
        if (geojsonLayer) {
            map.removeLayer(geojsonLayer);
        }
        
        geojsonLayer = L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
        
        map.fitBounds(geojsonLayer.getBounds());
        
        updateLegend(variable);
    } catch (error) {
        console.error('Error loading map data:', error);
        alert('Failed to load map data. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    
    document.getElementById('updateMap').addEventListener('click', updateMapData);
});
