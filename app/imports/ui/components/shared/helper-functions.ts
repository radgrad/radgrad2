export const toUpper = (str) => str.toUpperCase();

export const capitalizeFirstLetter = (str) => `${str.substr(0, 1).toUpperCase()}${str.substr(1).toLowerCase()}`;

export const isSame = (str1: string, str2: string): boolean => str1 === str2;
