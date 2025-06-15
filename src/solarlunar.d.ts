declare module 'solarlunar' {
  export interface Solar2LunarResult {
    lYear: number;
    lMonth: number;
    lDay: number;
    animal: string;      // zodiac animal
    monthCn: string;     // lunar month in Chinese
    dayCn: string;       // lunar day in Chinese
    cYear: number;
    cMonth: number;
    cDay: number;
    gzYear: string;
    gzMonth: string;
    gzDay: string;
    isLeap: boolean;
    nWeek: number;       // 1 (Mon) to 7 (Sun)
    ncWeek: string;      // Chinese weekday name
    isTerm: boolean;
    term?: string;
  }

  export interface Lunar2SolarResult {
    cYear: number;
    cMonth: number;
    cDay: number;
    lYear: number;
    lMonth: number;
    lDay: number;
    gzYear: string;
    gzMonth: string;
    gzDay: string;
    isLeap: boolean;
    animal: string;      // formerly 'Animal'
    monthCn: string;     // formerly 'IMonthCn'
    dayCn: string;       // formerly 'IDayCn'
    term?: string;       // formerly 'Term'
  }

  export function solar2lunar(
    year: number,
    month: number,
    day: number
  ): Solar2LunarResult;

  export function lunar2solar(
    year: number,
    month: number,
    day: number,
    isLeapMonth?: boolean
  ): Lunar2SolarResult;

}