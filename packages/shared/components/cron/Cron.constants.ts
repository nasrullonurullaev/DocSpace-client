import type { Options, PeriodType } from "./Cron.types";

export const defaultPeriod: PeriodType = "Hour";

export const defaultOptions: Options = {
  outputHashes: false,
  outputMonthNames: false,
  outputWeekdayNames: false,
};

export const defaultCronString = "* * * * *";
