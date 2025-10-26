async function updateForecast() {
    const location = document.getElementById('locationSelect').value;
    const variable = document.getElementById('variableSelect').value;
    
    try {
        const response = await fetch(
            `/api/forecast?location_id=${location}&variable=${variable}&horizon=monthly`
        );
        const data = await response.json();
        
        const dates = data.forecast.map(d => d.date);
        const values = data.forecast.map(d => d.value);
        const lowerBounds = data.forecast.map(d => d.lower_bound);
        const upperBounds = data.forecast.map(d => d.upper_bound);
        
        const unit = getVariableUnit(variable);
        
        const forecastTrace = {
            x: dates,
            y: values,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Forecast',
            line: {
                color: '#0891b2',
                width: 3
            },
            marker: {
                size: 8
            }
        };
        
        const confidenceTrace = {
            x: [...dates, ...dates.reverse()],
            y: [...upperBounds, ...lowerBounds.reverse()],
            fill: 'toself',
            fillcolor: 'rgba(8, 145, 178, 0.2)',
            line: {
                color: 'transparent'
            },
            type: 'scatter',
            name: '95% Confidence Interval',
            showlegend: true
        };
        
        const layout = {
            title: `3-Month ${capitalizeFirst(variable)} Forecast - ${capitalizeFirst(location)}`,
            xaxis: {
                title: 'Date',
                type: 'date'
            },
            yaxis: {
                title: `${capitalizeFirst(variable)} (${unit})`
            },
            hovermode: 'closest',
            plot_bgcolor: document.body.classList.contains('dark-mode') ? '#2a2a2a' : '#ffffff',
            paper_bgcolor: document.body.classList.contains('dark-mode') ? '#2a2a2a' : '#ffffff',
            font: {
                color: document.body.classList.contains('dark-mode') ? '#e5e5e5' : '#212529'
            }
        };
        
        const config = {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['lasso2d', 'select2d']
        };
        
        Plotly.newPlot('forecastChart', [confidenceTrace, forecastTrace], layout, config);
        
        displayModelInfo(data.model_info);
    } catch (error) {
        console.error('Error loading forecast:', error);
        alert('Failed to load forecast data. Please try again.');
    }
}

function displayModelInfo(modelInfo) {
    const infoDiv = document.getElementById('modelInfo');
    
    let html = `
        <p><strong>Model Type:</strong> ${modelInfo.model_type}</p>
        <p><strong>Status:</strong> ${modelInfo.trained ? 'Trained' : 'Using climatological averages'}</p>
        <p><strong>Description:</strong> ${modelInfo.description}</p>
    `;
    
    if (modelInfo.features) {
        html += `
            <p><strong>Features Used:</strong></p>
            <ul>
                ${modelInfo.features.map(f => `<li>${f.replace('_', ' ')}</li>`).join('')}
            </ul>
        `;
    }
    
    if (modelInfo.n_estimators) {
        html += `
            <p><strong>Model Parameters:</strong></p>
            <ul>
                <li>Number of Trees: ${modelInfo.n_estimators}</li>
                <li>Max Depth: ${modelInfo.max_depth}</li>
            </ul>
        `;
    }
    
    infoDiv.innerHTML = html;
}

function getVariableUnit(variable) {
    const units = {
        'temperature': '°C',
        'precipitation': 'mm',
        'humidity': '%',
        'wind_speed': 'm/s'
    };
    return units[variable] || '';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('updateForecast').addEventListener('click', updateForecast);
});
