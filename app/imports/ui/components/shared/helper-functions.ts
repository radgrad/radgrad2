export const toUpper = (str: string): string => str.toUpperCase();

export const capitalizeFirstOnly = (str: string): string => `${str.substr(0, 1).toUpperCase()}${str.substr(1).toLowerCase()}`;
