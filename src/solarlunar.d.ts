declare module 'solarlunar' {
  export interface Solar2LunarResult {
    lYear: number;
    lMonth: number;
    lDay: number;
    animal: string;
    monthCn: string;
    dayCn: string;
    cYear: number;
    cMonth: number;
    cDay: number;
    gzYear: string;
    gzMonth: string;
    gzDay: string;
    isLeap: boolean;
    nWeek: number;
    ncWeek: string;
    isTerm: boolean;
    term?: string;
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