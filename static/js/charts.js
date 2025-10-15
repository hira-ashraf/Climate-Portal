let currentData = null;

async function updateTimeSeries() {
    const location = document.getElementById('locationSelect').value;
    const variable = document.getElementById('variableSelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    try {
        const response = await fetch(
            `/api/timeseries?location_id=${location}&variable=${variable}&start=${startDate}&end=${endDate}`
        );
        const data = await response.json();
        
        currentData = data;
        
        const dates = data.data.map(d => d.date);
        const values = data.data.map(d => d.value);
        
        const unit = getVariableUnit(variable);
        
        const trace = {
            x: dates,
            y: values,
            type: 'scatter',
            mode: 'lines+markers',
            name: variable,
            line: {
                color: '#10b981',
                width: 2
            },
            marker: {
                size: 4
            }
        };
        
        const layout = {
            title: `${capitalizeFirst(variable)} Time Series - ${capitalizeFirst(location)}`,
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
        
        Plotly.newPlot('timeseriesChart', [trace], layout, config);
    } catch (error) {
        console.error('Error loading time series:', error);
        alert('Failed to load time series data. Please try again.');
    }
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

function downloadCSV() {
    if (!currentData || !currentData.data) {
        alert('No data available to download. Please load data first.');
        return;
    }
    
    const headers = ['Date', 'Value', 'Variable', 'Location'];
    const rows = currentData.data.map(d => [
        d.date,
        d.value,
        currentData.variable,
        currentData.location
    ]);
    
    let csvContent = headers.join(',') + '\n';
    csvContent += rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeseries_${currentData.location}_${currentData.variable}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
    updateTimeSeries();
    
    document.getElementById('updateChart').addEventListener('click', updateTimeSeries);
    document.getElementById('downloadCSV').addEventListener('click', downloadCSV);
});
