import { getCollectionData } from '../data-dump-utils';
import RadGradCollection, { RadGradCollectionName } from './RadGradCollection';
import { Doc, IDataDump } from './demo-fixture-generator';

const validateCareerGoalsAndInterests = (profile: Doc, interests: RadGradCollection, careerGoals: RadGradCollection) => {
  profile.interests.forEach((slug) => {
    if (!interests.isDefinedSlug(slug)) {
      throw new Error(`${slug} is not a defined Interest.`);
    }
  });
  profile.careerGoals.forEach((slug) => {
    if (!careerGoals.isDefinedSlug(slug)) {
      throw new Error(`${slug} is not a defined CareeerGoal.`);
    }
  });
};

const validateProfileCoursesAndOpportunities = (profile: Doc, courses: RadGradCollection, opportunities: RadGradCollection) => {
  profile.profileCourses.forEach((slug) => {
    if (!courses.isDefinedSlug(slug)) {
      throw new Error(`${slug} is not a defined Course`);
    }
  });
  profile.profileOpportunities.forEach((slug) => {
    if (!opportunities.isDefinedSlug(slug)) {
      throw new Error(`${slug} is not a defined Opportunity`);
    }
  });
};

export const validateFixture = (radgradDump: IDataDump) => {
  const courses = new RadGradCollection(RadGradCollectionName.COURSES, getCollectionData(radgradDump, RadGradCollectionName.COURSES));
  const opportunities = new RadGradCollection(RadGradCollectionName.OPPORTUNITIES, getCollectionData(radgradDump, RadGradCollectionName.OPPORTUNITIES));
  const careerGoals = new RadGradCollection(RadGradCollectionName.CAREER_GOALS, getCollectionData(radgradDump, RadGradCollectionName.CAREER_GOALS));
  const interests = new RadGradCollection(RadGradCollectionName.INTERESTS, getCollectionData(radgradDump, RadGradCollectionName.INTERESTS));
  const teasers = new RadGradCollection(RadGradCollectionName.TEASERS, getCollectionData(radgradDump, RadGradCollectionName.TEASERS));
  const teaserSlugs = teasers.getContents().map((teaser) => teaser.targetSlug);
  teaserSlugs.forEach((slug) => {
    if (!(courses.isDefinedSlug(slug) || opportunities.isDefinedSlug(slug) || careerGoals.isDefinedSlug(slug) || interests.isDefinedSlug(slug))) {
      throw new Error(`Teaser target ${slug} is not a defined career goal, course, interest, or opportunity`);
    }
  });
  const students = new RadGradCollection(RadGradCollectionName.STUDENT_PROFILES, getCollectionData(radgradDump, RadGradCollectionName.STUDENT_PROFILES));
  students.getContents().forEach((profile) => {
    validateCareerGoalsAndInterests(profile, interests, careerGoals);
    validateProfileCoursesAndOpportunities(profile, courses, opportunities);
  });
};
