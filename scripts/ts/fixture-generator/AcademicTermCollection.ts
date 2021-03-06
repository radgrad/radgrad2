import _ from 'lodash';
import moment from 'moment';
import RadGradCollection from './RadGradCollection';

export enum AcademicTerms {
  FALL = 'Fall',
  WINTER = 'Winter',
  SPRING = 'Spring',
  SUMMER = 'Summer',
}

class AcademicTermCollection extends RadGradCollection {
  constructor(contents) {
    super('AcademicTermCollection', contents);
  }

  public isQuarterSystem() {
    const termNames = [];
    this.contents.map((t) => termNames.push(t.term));
    const uniq = _.uniq(termNames);
    return uniq.length % 4 === 0;
  }

  public getCurrentTerm() {
    const isQuarter = this.isQuarterSystem();
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
  }

  public getTerm = (academicTerm: string): string => academicTerm.split('-')[0];
  public getYear = (academicTerm: string): number => parseInt(academicTerm.split('-')[1], 10);

  public nextAcademicTerm(academicTerm: string) {
    const currentTerm = this.getTerm(academicTerm);
    const currentYear = this.getYear(academicTerm);
    let term;
    let year = currentYear;
    switch (currentTerm) {
      case AcademicTerms.FALL: {
        if (this.isQuarterSystem()) {
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
  }

  public nextNonSummerTerm = (academicTerm: string): string => {
    const next = this.nextAcademicTerm(academicTerm);
    if (this.getTerm(next) === AcademicTerms.SUMMER) {
      return this.nextAcademicTerm(next);
    }
    return next;
  };

  public multipleNextNonSummerTerm = (academicTerm: string, numTerms: number) => {
    let next;
    for (let i = 0; i < numTerms; i++) {
      next = this.nextNonSummerTerm(academicTerm);
    }
    return next;
  };

  public prevAcademicTerm = (academicTerm: string): string => {
    const currentTerm = this.getTerm(academicTerm);
    const currentYear = this.getYear(academicTerm);
    let term;
    let year = currentYear;
    switch (currentTerm) {
      case AcademicTerms.SPRING: {
        if (this.isQuarterSystem()) {
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

  public prevNonSummerTerm = (academicTerm: string): string => {
    const prev = this.prevAcademicTerm(academicTerm);
    if (this.getTerm(prev) === AcademicTerms.SUMMER) {
      return this.prevAcademicTerm(prev);
    }
    return prev;
  };

  public multiplePrevNonSummerTerm = (academicTerm: string, numTerms: number) => {
    let prev;
    for (let i = 0; i < numTerms; i++) {
      prev = this.prevNonSummerTerm(academicTerm);
    }
    return prev;
  };

  public compareTerms = (term1: string, term2: string): number => {
    const year1 = this.getYear(term1);
    const year2 = this.getYear(term2);
    const t1 = this.getTerm(term1);
    const t2 = this.getTerm(term2);
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
}

export default AcademicTermCollection;
