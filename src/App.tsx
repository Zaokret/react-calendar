import { useMemo, useRef } from 'react';
import './App.css';
import { chunkWeeks, DOW, getGridDates } from './time';
import { useDOWPreference } from './context';

type GridDate = {
  date: Date;
  isOutsidePeriod: boolean;
  yearMonthKey: string;
}

function ActivityGrid({ start, end, orientation }: { start: Date, end: Date, orientation: 'horizontal' | 'vertical' }) {
  const [offset] = useDOWPreference()
  const dow = new DOW(offset);
  console.log(dow)
  const { gridDates, weeks } = useMemo(() => {
    const gridDates = getGridDates(start, end, dow)
    const enriched = gridDates.map(d => ({
      date: d,
      isOutsidePeriod: d.getTime() < start.getTime() || d.getTime() >= end.getTime(),
      yearMonthKey: `${d.getFullYear()}-${d.getMonth()}`
    }))
    return {
      gridDates: enriched,
      weeks: chunkWeeks(enriched)
    }
  }, [offset, start, end])
  return (
    <div className={`activity-wrapper ${orientation === 'vertical' ? "is-vertical" : ""}`}>
      <MonthLabels weeks={weeks} />
      <DayLabels dow={dow} orientation={orientation} />
      <Grid gridDates={gridDates} />
    </div>
  )
}

function MonthLabels({ weeks }: { weeks: GridDate[][] }) {
  return (<div className="months">
    {weeks.map((week, i) => {
      const firstDayOfMonth = week.find(d => d.date.getDate() === 1 && !d.isOutsidePeriod);
      if (firstDayOfMonth) {
        return (
          <div key={i} className="month-label">
            {firstDayOfMonth.date.toLocaleString('en', { month: 'short' })}
          </div>
        );
      } else if (i === 0) { // grid begins at the middle of the month
        return (
          <div key={i} className="month-label">
            {week[0].date.toLocaleString('en', { month: 'short' })}
          </div>
        );
      }
      return <div key={i} />
    })}
  </div>
  )
}

function DayLabels({ dow, orientation }: { dow: DOW, orientation: 'horizontal' | 'vertical' }) {
  return (<div className="dow">
    {dow.list.map((name, i) => {
      return <div key={name} className="dow-label">{orientation !== 'vertical' || i === 0 || i === 6 ? name : ""}</div>
    })}
  </div>)
}

function Grid({ gridDates }: { gridDates: { date: Date, isOutsidePeriod: boolean, yearMonthKey: string }[] }) {
  const gridRef = useRef<HTMLDivElement>(null)
  function onMouseOver(e: React.MouseEvent) {
    const el: HTMLElement | null = (e.target as HTMLElement).closest(".cell");
    if (!el || !gridRef.current) return;

    gridRef.current
      .querySelectorAll(`.cell.active`)
      .forEach((n) => n.classList.remove("active"));

    const idx = parseInt(el.dataset.index || '')
    if (isNaN(idx)) return;
    const cell = gridDates[idx];
    if (cell && !cell.isOutsidePeriod) {
      gridRef.current
        .querySelectorAll(`.cell[data-date="${cell.yearMonthKey}"]`)
        .forEach((n) => n.classList.add("active"));
    }
  }
  return (
    <div className="activity-grid" ref={gridRef} onMouseOver={onMouseOver}>
      {gridDates.map((d, i) => {
        const activity = String(Math.floor(Math.random() * 5));
        return <div
          title={`${activity} activities on ${d.date.toLocaleDateString('en', { dateStyle: 'short' })}`}
          key={d.date.toISOString()}
          className={`cell ${d.isOutsidePeriod ? "ignore" : ""}`}
          data-index={i}
          data-date={d.yearMonthKey}
          data-level={activity}>
          <div className="dot"></div>
        </div>
      })}
    </div>
  )
}

export default ActivityGrid
