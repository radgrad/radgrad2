import _ from 'lodash';

export interface Doc {
  slug?: string;
  term?: string;
}

export enum RadGradCollectionName {
  ACADEMIC_TERMS = 'AcademicTermCollection',
  ADMIN_PROFILES = 'AdminProfileCollection',
  ADVISOR_PROFILES = 'AdvisorProfileCollection',
  CAREER_GOALS = 'CareerGoalCollection',
  COURSES = 'CourseCollection',
  COURSE_INSTANCES = 'CourseInstanceCollection',
  FACULTY_PROFILES = 'FacultyProfileCollection',
  INTERESTS = 'InterestCollection',
  INTEREST_TYPES = 'InterestTypeCollection',
  OPPORTUNITIES = 'OpportunityCollection',
  OPPORTUNITY_INSTANCES = 'OpportunityInstanceCollection',
  OPPORTUNITY_TYPES = 'OpportunityTypeCollection',
  PROFILE_CAREER_GOALS = 'ProfileCareerGoalCollection',
  PROFILE_COURSES = 'ProfileCourseCollection',
  PROFILE_INTERESTS = 'ProfileInterestCollection',
  PROFILE_OPPORTUNITIES = 'ProfileOpportunityCollection',
  REVIEWS = 'ReviewCollection',
  STUDENT_PROFILES = 'StudentProfileCollection',
  TEASERS = 'TeaserCollection',
  USER_INTERACTIONS = 'UserInteractionCollection',
  VERIFICATION_REQUESTS = 'VerificationRequestCollection',
}

class RadGradCollection {
  protected name: string;
  protected contents: Doc[];

  constructor(collectionName: string, contents: Doc[]) {
    this.name = collectionName;
    this.contents = contents;
  }

  public getName() {
    return this.name;
  }

  public count() {
    return this.contents.length;
  }

  public getContents() {
    return this.contents;
  }

  public getDocBySlug(slug: string) {
    const document = this.contents.find((doc) => doc.slug === slug);
    return document;
  }

  public getRandomSlugs(num: number) {
    const retVal = [];
    for (let i = 0; i < 2 * num; i++) {
      const doc = this.contents[Math.floor(Math.random() * this.contents.length)];
      retVal.push(doc.slug);
    }
    return _.uniq(retVal).slice(0, num);
  }

  public compareTo(other: RadGradCollection): number {
    if (this.name < other.name) {
      return -1;
    }
    if (this.name > other.name) {
      return 1;
    }
    return 0;
  }

  public toCollection() {
    return {
      name: this.name,
      contents: this.contents,
    };
  }
}

export default RadGradCollection;
