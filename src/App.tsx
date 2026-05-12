import { useMemo, useRef } from 'react';
import './App.css';
import { chunkWeeks, DOW, getGridDates } from './time';
import { useDOWPreference } from './Context';

type GridDate = {
  date: Date;
  isOutsidePeriod: boolean;
  yearMonthKey: string;
  isDowShown: boolean;
  idx: number;
  relWeekIdx: number;
}

function ActivityGrid({ start, end, orientation }: { start: Date, end: Date, orientation: 'horizontal' | 'vertical' }) {
  start.setHours(0,0,0,0)
  end.setHours(0,0,0,0)
  const [dowPref] = useDOWPreference()
  const dow = new DOW(dowPref.offset);
  let daysOfWeek = dowPref.dowSelected.reduce((idxes, next, i) => {
    if(next) idxes.push(i)
    return idxes
  }, [] as number[])
  console.log(daysOfWeek)
  const { gridDates, weeks } = useMemo(() => {
    const gridDates = getGridDates(start, end, dow)
    const enriched = gridDates.map((d, idx) => ({
      date: d,
      isOutsidePeriod: d.getTime() < start.getTime() || d.getTime() >= end.getTime(),
      yearMonthKey: `${d.getFullYear()}-${d.getMonth()}`,
      isDowShown: daysOfWeek.includes(dow.getDay(d)),
      idx: idx,
      relWeekIdx: Math.floor(idx / 7)
    }))
    return {
      gridDates: enriched,
      weeks: chunkWeeks(enriched)

    }
  }, [dowPref.dowSelected, dowPref.offset, start, end, daysOfWeek])
  return (
    <div className={`activity-wrapper ${orientation === 'vertical' ? "is-vertical" : ""}`}>
      <MonthLabels weeks={weeks} daysOfWeek={daysOfWeek} />
      <DayLabels dow={dow} orientation={orientation} daysOfWeek={daysOfWeek} />
      <Grid gridDates={gridDates} weeks={weeks} />
    </div>
  )
}

function MonthLabels({ weeks, daysOfWeek }: { weeks: GridDate[][], daysOfWeek: number[] }) {
  return (<div className="months">
    {weeks.map((week, i) => {
      const firstDayOfMonth = week.find(d => d.date.getDate() === 1 && !d.isOutsidePeriod);
      const firstDayOfWeek = week[daysOfWeek[0]];
      if (firstDayOfMonth && week.some(d => d.isDowShown)) {
        return <MonthLabel key={i} date={firstDayOfMonth.date}/>
      } else if (i === 0 && firstDayOfWeek.isDowShown) { // grid begins at the middle of the month
        return <MonthLabel key={i} date={week[daysOfWeek[0]].date}/>
      }
      return <div key={i} />
    })}
  </div>
  )
}

function MonthLabel({date}: {date: Date}) {
  return (<div className="month-label">
    {date.toLocaleString('en', { month: 'short' })}
  </div>)
}


function DayLabels({ dow, orientation,daysOfWeek }: { dow: DOW, orientation: 'horizontal' | 'vertical', daysOfWeek: number[] }) {
  const days = dow.list;
  return (<div className="dow">
    {dow.list.filter((_,i) => daysOfWeek.includes(i)).map((name) => {

      return <div key={name} className="dow-label">{orientation !== 'vertical' || name === days[daysOfWeek[0]] || name === days[daysOfWeek[daysOfWeek.length-1]] ? name : ""}</div>
    })}
  </div>)
}

function Grid({ gridDates, weeks }: { gridDates: GridDate[], weeks: GridDate[][]}) {
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
      {gridDates.map((d) => {
        const toRemove = d.isOutsidePeriod && !weeks[d.relWeekIdx].some(o => o.isDowShown && o !== d)
        const activity = String(Math.floor(Math.random() * 5));
        return <div
          title={`${activity} activities on ${d.date.toLocaleDateString('en', { dateStyle: 'short' })}`}
          key={d.date.toISOString()}
          className={`cell ${d.isOutsidePeriod ? "ignore" : ""} ${!d.isDowShown || toRemove ? "remove": ''}`}
          data-index={d.idx}
          data-date={d.yearMonthKey}
          data-level={activity}>
          <div className="dot"></div>
        </div>
      })}
    </div>
  )
}

export default ActivityGrid
