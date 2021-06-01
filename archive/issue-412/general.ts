import { AcademicTerms } from '../../app/imports/api/academic-term/AcademicTermCollection';

export const toUpper = (str: string): string => str.toUpperCase();

export const capitalizeFirstOnly = (str: string): string => `${str.substr(0, 1).toUpperCase()}${str.substr(1).toLowerCase()}`;

export const capitalizeFirstLetter = (str) => `${str.substr(0, 1).toUpperCase()}${str.substr(1).toLowerCase()}`;

export const isSame = (str1: string, str2: string): boolean => str1 === str2;

export const replaceTermString = (array: string[]): string => {
  const termString = array.join(', ');
  return termString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
};

export const replaceTermStringNextFour = (array: string[]): string => {
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const currentYear = currentTerm.year;
  let fourRecentTerms = array.filter((termYear) => termYear.split(' ')[1] >= currentYear);
  fourRecentTerms = array.slice(0, 4);
  const termString = fourRecentTerms.join(' - ');
  return termString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
};

export const getFirstSentance = (description: string): string => {
  const squareIndex = description.indexOf(']');
  const parenIndex = description.indexOf(')');
  let periodIndex = description.indexOf('.');
  if (squareIndex !== -1 && squareIndex < periodIndex) {
    periodIndex = description.indexOf('.', parenIndex);
  }
  return description.substring(0, periodIndex + 1);
};
