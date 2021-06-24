export const ONE_MINUTE = 60;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;

export const capitalize = (str: string): string =>
  str[0].toUpperCase() + str.slice(1);
