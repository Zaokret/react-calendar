
function startOfNextMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setMonth(result.getMonth() + 1);
  return result;
}

function shiftDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function get12MonthPeriod(targetDate: Date): {startDate: Date, endDate: Date} {
  const now = new Date();
  now.setHours(0,0,0,0)

  const endDate = new Date(
    targetDate.getTime() >= now.getTime() ? targetDate : startOfNextMonth(targetDate)
  );

  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 12);

  endDate.setDate(endDate.getDate() + 1)
  return { startDate, endDate };
}

export class DOW {
  constructor(offset: number) {
    this.setOffset(offset)
  }
  static OffsetTypes = {
    US: 0,
    EU: 1
  }
  public offset: number = DOW.OffsetTypes.US
  public setOffset(offset: number): void {
    this.offset = offset
  }

  public readonly names: string[] = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ]

  public get list(): string[] {
    return this.names.map((_, i, all) => {
      return all[this.applyOffset(i)]
    })
  }

  public applyOffset(index: number): number {
    return ((index + this.offset) % 7 + 7) % 7;

  }
  public at(index: number): string {
    return this.names[this.applyOffset(index)];
  }

  public getDay(date: Date) {
    return ((date.getDay() - this.offset) % 7 + 7) % 7
  }

}

export function getGridDates(gridStart: Date, gridEnd: Date, dow: DOW): Date[] {
  const gridStartDOW = dow.getDay(gridStart)
  const weekGridStart = shiftDays(gridStart, -gridStartDOW);

  const gridEndDow = dow.getDay(gridEnd)
  const weekGridEnd = shiftDays(gridEnd, (7 - gridEndDow) % 7)
  let arr = []
  while (weekGridStart.getTime() < weekGridEnd.getTime()) {
    arr.push(new Date(weekGridStart))
    weekGridStart.setDate(weekGridStart.getDate() + 1)
  }
  return arr;
}

export function chunkWeeks<T>(arr: T[], size = 7): T[][] {
  const weeks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    weeks.push(arr.slice(i, i + size));
  }
  return weeks;
}
