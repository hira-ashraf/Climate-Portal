# Pakistan Climate Information Portal

A modern, dark-themed climate analytics portal built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

### Pages Created

1. **Landing Page** (`/`)
   - Full-screen hero section with animated background
   - Features showcase with hover effects
   - Statistics bar
   - Dashboard preview section
   - Comprehensive footer

2. **Main Dashboard** (`/main-dashboard` or `/dashboard`)
   - Sidebar navigation with all climate modules
   - KPI cards showing key metrics with trends
   - Interactive map placeholder
   - Time series and bar charts
   - Recent alerts panel
   - Data quality gauge
   - Provincial data table

3. **Temperature Analysis** (`/temperature`)
   - Multi-parameter selector (Mean, Min, Max, Anomaly)
   - Temporal aggregation controls
   - Large trend visualization with comparison
   - Spatial distribution map
   - Statistics panel
   - Distribution analysis (histogram, box plot, seasonal)
   - Detailed data table with export

4. **Precipitation Analysis** (`/precipitation`)
   - Combined bar and line chart
   - Spatial rainfall map with animation
   - Seasonal pattern visualization
   - Quick stats cards
   - Monsoon performance tracking
   - Heavy precipitation events timeline

5. **Heat Stress Analysis** (`/heat-stress`)
   - Interactive heat index calculator
   - Risk category legend with health impacts
   - Spatial heat distribution map
   - Days above threshold analysis
   - Population exposure pie chart
   - Long-term trend analysis
   - Public health advisories

6. **Drought Indices** (`/drought`)
   - SPEI/SPI toggle with multiple timescales
   - Animated drought distribution map
   - Time series with drought thresholds
   - Severity breakdown by area
   - Affected areas statistics
   - District-level detailed table

7. **Extreme Events** (`/extreme-events`)
   - Event timeline with filtering
   - Event type tabs (Heatwaves, Heavy Rain, Cold Spells)
   - Detailed event cards with metadata
   - Event comparison tool
   - Filter panel with multiple criteria
   - Frequency trends
   - Seasonal patterns

8. **Data Explorer** (`/data-explorer`)
   - Interactive query builder
   - Parameter selection with accordions
   - Temporal and spatial selection
   - Multiple output formats (CSV, NetCDF, GeoJSON, JSON)
   - Data preview table
   - Quick visualization
   - Summary statistics
   - API query generation (Python, REST)

9. **Settings** (`/settings`)
   - General settings (language, timezone, date format)
   - Display preferences (theme, colors, map style)
   - Data preferences (units, defaults, auto-refresh)
   - Notification settings
   - API access with usage stats
   - Account management
   - About section with version info

## 🎨 Design System

### Colors
```javascript
background: #0f1419
surface: #1a1d29
card: #1e2433
border: #2d3142
primary-blue: #3b82f6
```

### Typography
- Font Family: Inter
- Headings: 600-700 weight
- Body: 400-500 weight

### Components
- Border Radius: 12px (cards), 8px (buttons)
- Transitions: 200ms ease
- Shadows: Subtle glows with blue accent

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Router** - Navigation

## 📁 File Structure

```
frontend/src/
├── pages/
│   ├── LandingPage.tsx
│   ├── MainDashboard.tsx
│   ├── TemperatureAnalysis.tsx
│   ├── PrecipitationAnalysis.tsx
│   ├── HeatStress.tsx
│   ├── DroughtIndices.tsx
│   ├── ExtremeEvents.tsx
│   ├── DataExplorer.tsx
│   └── SettingsPage.tsx
├── App.tsx (updated with new routes)
├── index.css (updated with dark theme)
└── ...
```

## 🚦 Routes

| Route | Page |
|-------|------|
| `/` | Landing Page |
| `/dashboard` or `/main-dashboard` | Main Dashboard |
| `/temperature` | Temperature Analysis |
| `/precipitation` | Precipitation Analysis |
| `/heat-stress` | Heat Stress Analysis |
| `/drought` | Drought Indices |
| `/extreme-events` | Extreme Events |
| `/data-explorer` | Data Explorer |
| `/settings` | Settings |

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt to screen size
- Collapsible sidebar on mobile

### Dark Theme
- Consistent dark color palette
- High contrast for readability
- Subtle glow effects for emphasis

### Animations
- Framer Motion for smooth page transitions
- Hover effects on interactive elements
- Loading states and skeletons

### Data Visualization
- Recharts for responsive charts
- Multiple chart types (line, bar, area, pie)
- Interactive tooltips and legends

### Accessibility
- Semantic HTML
- Keyboard navigation
- Focus states
- Screen reader support

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Sample Data

All pages currently use sample/mock data for demonstration. To connect to real data:

1. Update API endpoints in `lib/api.ts`
2. Replace sample data arrays with API calls
3. Add loading states
4. Implement error handling

## 🎨 Customization

### Colors
Update colors in `tailwind.config.js`:
```javascript
colors: {
  background: '#0f1419',
  surface: '#1a1d29',
  card: '#1e2433',
  border: '#2d3142',
}
```

### Charts
Modify chart configurations in each page component. Charts use Recharts with customizable:
- Colors
- Tooltips
- Legends
- Axes
- Animations

## 📝 Notes

- All pages are fully styled and functional
- Navigation between pages works seamlessly
- Dark theme is applied globally
- Old dashboard routes preserved for backward compatibility
- Ready for backend integration

## 🚀 Next Steps

1. Connect to real climate data APIs
2. Add authentication/authorization
3. Implement actual map visualizations (Leaflet/Mapbox)
4. Add data caching
5. Implement real-time updates
6. Add export functionality
7. Create user preferences persistence
8. Add more detailed analytics

## 📞 Support

For questions or issues, refer to the main project README.

---

Built with ❤️ for Pakistan Climate Information Portal

