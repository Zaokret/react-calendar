import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Heatmap from './App.tsx';
import { get12MonthPeriod } from './time.ts';
import HeatmapControls, { type HeatmapConfig } from './Controller.tsx';
import { DOWPreferenceProvider, useDOWPreference } from './context.tsx';

function App() {
  const {startDate, endDate} = get12MonthPeriod(new Date())
  const [dowOffset, setDowOffset] = useDOWPreference()
  const [config, setConfig] = useState<HeatmapConfig>({
  orientation: 'horizontal',
  color: '#ff0000',
  dowOffset: dowOffset,
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
    setDowOffset(c.dowOffset)
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
