import _ from 'lodash';
import moment from 'moment';

export enum AcademicTerms {
  FALL = 'Fall',
  WINTER = 'Winter',
  SPRING = 'Spring',
  SUMMER = 'Summer',
}

export const isQuarterSystem = (academicTerms) => {
  const termNames = [];
  academicTerms.map((t) => termNames.push(t.term));
  const uniq = _.uniq(termNames);
  return uniq.length % 4 === 0;
};

export const getTerm = (academicTerm: string): string => academicTerm.split('-')[0];

export const getYear = (academicTerm: string): number => parseInt(academicTerm.split('-')[1], 10);

export const getCurrentTerm = (academicTerms) => {
  const isQuarter = isQuarterSystem(academicTerms);
  let fallStart;
  let springStart;
  let summerStart;
  if (isQuarter) {
    fallStart = parseInt(moment('09-26-2015', 'MM-DD-YYYY').format('DDD'), 10);
    springStart = parseInt(moment('04-01-2015', 'MM-DD-YYYY').format('DDD'), 10);
    summerStart = parseInt(moment('06-20-2015', 'MM-DD-YYYY').format('DDD'), 10);
  } else {
    fallStart = parseInt(moment('08-15-2015', 'MM-DD-YYYY').format('DDD'), 10);
    springStart = parseInt(moment('01-01-2015', 'MM-DD-YYYY').format('DDD'), 10);
    summerStart = parseInt(moment('05-15-2015', 'MM-DD-YYYY').format('DDD'), 10);
  }
  const year = moment().year();
  const day = moment().dayOfYear();
  let term = '';
  if (isQuarter) {
    if (day >= fallStart) {
      term = AcademicTerms.FALL;
    } else if (day >= summerStart) {
      term = AcademicTerms.SUMMER;
    } else if (day >= springStart) {
      term = AcademicTerms.SPRING;
    } else {
      term = AcademicTerms.WINTER;
    }
  } else if (day >= fallStart) {
    term = AcademicTerms.FALL;
  } else if (day >= summerStart) {
    term = AcademicTerms.SUMMER;
  } else {
    term = AcademicTerms.SPRING;
  }
  return `${term}-${year}`;
};

export const nextAcademicTerm = (academicTerm: string, quarters: boolean): string => {
  const currentTerm = getTerm(academicTerm);
  const currentYear = getYear(academicTerm);
  let term;
  let year = currentYear;
  switch (currentTerm) {
    case AcademicTerms.FALL: {
      if (quarters) {
        term = AcademicTerms.WINTER;
      } else {
        term = AcademicTerms.SPRING;
        year += 1;
      }
      break;
    }
    case AcademicTerms.WINTER: {
      term = AcademicTerms.SPRING;
      year += 1;
      break;
    }
    case AcademicTerms.SPRING: {
      term = AcademicTerms.SUMMER;
      break;
    }
    default:
      term = AcademicTerms.FALL;
  }
  return `${term}-${year}`;
};

export const nextNonSummerTerm = (academicTerm: string, quarters: boolean): string => {
  const next = nextAcademicTerm(academicTerm, quarters);
  if (getTerm(next) === AcademicTerms.SUMMER) {
    return nextAcademicTerm(next, quarters);
  }
  return next;
};

export const multipleNextNonSummerTerm = (academicTerm: string, quarters: boolean, numTerms: number) => {
  let next;
  for (let i = 0; i < numTerms; i++) {
    next = nextNonSummerTerm(academicTerm, quarters);
  }
  return next;
};

export const prevAcademicTerm = (academicTerm: string, quaters: boolean): string => {
  const currentTerm = getTerm(academicTerm);
  const currentYear = getYear(academicTerm);
  let term;
  let year = currentYear;
  switch (currentTerm) {
    case AcademicTerms.SPRING: {
      if (quaters) {
        term = AcademicTerms.WINTER;
      } else {
        term = AcademicTerms.FALL;
      }
      year -= 1;
      break;
    }
    case AcademicTerms.WINTER:
      term = AcademicTerms.FALL;
      break;
    case AcademicTerms.FALL:
      term = AcademicTerms.SUMMER;
      break;
    default:
      term = AcademicTerms.SPRING;
  }
  return `${term}-${year}`;
};

export const prevNonSummerTerm = (academicTerm: string, quarters: boolean): string => {
  const prev = prevAcademicTerm(academicTerm, quarters);
  if (getTerm(prev) === AcademicTerms.SUMMER) {
    return prevAcademicTerm(prev, quarters);
  }
  return prev;
};

export const multiplePrevNonSummerTerm = (academicTerm: string, quarters: boolean, numTerms: number) => {
  let prev;
  for (let i = 0; i < numTerms; i++) {
    prev = prevNonSummerTerm(academicTerm, quarters);
  }
  return prev;
};

export const compareTerms = (term1: string, term2: string): number => {
  const year1 = getYear(term1);
  const year2 = getYear(term2);
  const t1 = getTerm(term1);
  const t2 = getTerm(term2);
  const result = year1 - year2;
  if (result === 0) { // same year
    switch (t1) {
      case AcademicTerms.WINTER:
        if (t2 === AcademicTerms.WINTER) {
          return 0;
        }
        return 1;
      case AcademicTerms.FALL:
        if (t2 === AcademicTerms.WINTER) {
          return -1;
        }
        if (t2 === AcademicTerms.FALL) {
          return 0;
        }
        return 1;
      case AcademicTerms.SUMMER:
        if (t2 === AcademicTerms.SPRING) {
          return 1;
        }
        if (t2 === AcademicTerms.SUMMER) {
          return 0;
        }
        return -1;
      default:
        if (t2 === AcademicTerms.SPRING) {
          return 0;
        }
        return -1;
    }
  }
  return result;
};

export const isSummerTerm = (academicTerm: string) => getTerm(academicTerm) === AcademicTerms.SUMMER;
