import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Heatmap from './App.tsx';
import HeatmapControls, { type HeatmapConfig } from './Controller.tsx';
import { DOWPreferenceProvider, useDOWPreference } from './Context.tsx';

function App() {
  // const {startDate, endDate} = get12MonthPeriod(new Date())
  const now = new Date()
  const startDate = new Date(`${now.getFullYear()}-01-01`)
  const endDate = new Date(`${now.getFullYear()}-06-01`)
  const [dowOffset, setDowOffset] = useDOWPreference()
  const [config, setConfig] = useState<HeatmapConfig>({
  orientation: 'horizontal',
  color: '#ff0000',
  dowOffset: dowOffset.offset,
  dowSelected: dowOffset.dowSelected,
  start: startDate,
  end: endDate,
  size: 16,
  radius: 5
})
  return (<>
  <HeatmapControls config={config} onChange={(c) => {
    document.documentElement.style.setProperty('--grid-activity-color', c.color)
    document.documentElement.style.setProperty('--grid-cell-size', `${c.size/10}rem`)
    document.documentElement.style.setProperty('--grid-cell-radius', `${c.radius/10}rem`)
    document.documentElement.style.setProperty('--grid-dow-count', c.dowSelected.filter(Boolean).length.toString())
    setDowOffset({ offset: c.dowOffset, dowSelected: c.dowSelected})
    setConfig(c)
  }}/>
  <Heatmap start={config.start} end={config.end} orientation={config.orientation}/></>)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DOWPreferenceProvider>
      <App/>
    </DOWPreferenceProvider>
  </StrictMode>,
)
