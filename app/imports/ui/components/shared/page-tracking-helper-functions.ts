import {
  ICareerGoal,
  ICourse,
  IInterest, IOpportunity,
  IPageInterestInfo,
  IPageInterestsDailySnapshot, ISlug,
} from '../../../typings/radgrad';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getLastUrlParam, IMatchProps } from './RouterHelperFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';

export interface IAggregatedDailySnapshot {
  careerGoals: IPageInterestInfo[];
  courses: IPageInterestInfo[];
  interests: IPageInterestInfo[];
  opportunities: IPageInterestInfo[];
}

// urlCategory is of type PageInterestsCategoryTypes
export const getUrlCategory = (match: IMatchProps) => getLastUrlParam(match) as PageInterestsCategoryTypes;

// category is of type IPageInterestsDailySnapshot
export const getCategory = (selectedCategory: IPageInterestsCategoryTypes): string => {
  switch (selectedCategory) {
    case PageInterestsCategoryTypes.CAREERGOAL:
      return 'careerGoals';
    case PageInterestsCategoryTypes.COURSE:
      return 'courses';
    case PageInterestsCategoryTypes.INTEREST:
      return 'interests';
    case PageInterestsCategoryTypes.OPPORTUNITY:
      return 'opportunities';
    default:
      console.error(`Bad selectedCategory: ${selectedCategory}`);
      break;
  }
  return undefined;
};

export const aggregateDailySnapshots = (snapshots: IPageInterestsDailySnapshot[]): IAggregatedDailySnapshot => {
  const aggregatedSnapshot: IAggregatedDailySnapshot = {
    careerGoals: [],
    courses: [],
    interests: [],
    opportunities: [],
  };
  // Arrays that contain areas that have already been iterated through for each corresponding topic category
  const foundCareerGoals = [];
  const foundCourses = [];
  const foundInterests = [];
  const foundOpportunities = [];
  snapshots.forEach((snapshot) => {
    // Career Goals
    snapshot.careerGoals.forEach((careerGoal) => {
      const careerGoalInstance: IPageInterestInfo = { name: careerGoal.name, views: careerGoal.views };
      // If we haven't iterated through this career goal, push it to the aggregated snapshot and found career goals.
      if (!containsKey(careerGoal, foundCareerGoals)) {
        foundCareerGoals.push(careerGoalInstance);
        aggregatedSnapshot.careerGoals.push(careerGoalInstance);
        // Otherwise, simply increment the career goal already pushed to the aggregated snapshot with the number of views appropriately
      } else {
        aggregatedSnapshot.careerGoals.filter((cg) => careerGoal.name === cg.name)[0].views += careerGoal.views;
      }
    });
    // Courses
    snapshot.courses.forEach((course) => {
      const courseInstance: IPageInterestInfo = { name: course.name, views: course.views };
      if (!containsKey(course, foundCourses)) {
        foundCourses.push(courseInstance);
        aggregatedSnapshot.courses.push(courseInstance);
      } else {
        aggregatedSnapshot.courses.filter((c) => course.name === c.name)[0].views += course.views;
      }
    });
    // Interests
    snapshot.interests.forEach((interest) => {
      const interestInstance: IPageInterestInfo = { name: interest.name, views: interest.views };
      if (!containsKey(interest, foundInterests)) {
        foundInterests.push(interestInstance);
        aggregatedSnapshot.interests.push(interestInstance);
      } else {
        aggregatedSnapshot.interests.filter((i) => interest.name === i.name)[0].views += interest.views;
      }
    });
    // Opportunities
    snapshot.opportunities.forEach((opportunity) => {
      const opportunityInstance: IPageInterestInfo = { name: opportunity.name, views: opportunity.views };
      if (!containsKey(opportunity, foundOpportunities)) {
        foundOpportunities.push(opportunityInstance);
        aggregatedSnapshot.opportunities.push(opportunityInstance);
      } else {
        aggregatedSnapshot.opportunities.filter((opp) => opportunity.name === opp.name)[0].views += opportunity.views;
      }
    });
  });
  return aggregatedSnapshot;
};

const containsKey = (object: IPageInterestInfo, arr: IPageInterestInfo[]) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === object.name) {
      return true;
    }
  }
  return false;
};

export const parseName = (category: IPageInterestsCategoryTypes, slug: string): string => {
  let doc: (ICareerGoal | ICourse | IInterest | IOpportunity);
  switch (category) {
    case PageInterestsCategoryTypes.CAREERGOAL:
      doc = CareerGoals.findDocBySlug(slug);
      break;
    case PageInterestsCategoryTypes.COURSE:
      doc = Courses.findDocBySlug(slug);
      break;
    case PageInterestsCategoryTypes.INTEREST:
      doc = Interests.findDocBySlug(slug);
      break;
    case PageInterestsCategoryTypes.OPPORTUNITY:
      doc = Opportunities.findDocBySlug(slug);
      break;
    default:
      console.error(`Bad category: ${category}`);
      break;
  }
  return doc.name;
};

export const slugIDToSlugName = (slugID) => Slugs.findOne(slugID).name;

// Calculates how long to wait (since the time the student has opened the page) before they're considered "interested" in that item
export const calculateEngagedInterestTime = (slugName: string): number => {
  const slug: ISlug = Slugs.findOne({ name: slugName });
  const type = slug.entityName;
  const descriptionText = getDescriptionText(type, slugName);

  const descriptionTextStrings: string[] = descriptionText.split(' ');
  const removedHttpLinks: string[] = descriptionTextStrings.filter((str) => !str.includes('http')); // Remove the Markdown http links
  const validWordLength: number = 3; // Number of characters for a string to be considered a "word"
  const validDescriptionTextStrings: string[] = removedHttpLinks.filter((str) => str.length >= validWordLength); // Remove strings that aren't "valid words"
  const isLongDescriptionText: boolean = validDescriptionTextStrings.length > 50; // If there are more than 50 words, it's considered a long description

  const wpm = isLongDescriptionText ? 275 : 250; // Words per minute. We expect that the longer a description is, the faster a english-literate college student reads
  // We expect that in order for a student to have been considered "interested" in the item they're reading
  // that they have read around half of the words in the description
  const expectedNumberOfWords = validDescriptionTextStrings.length / 2;
  const estimatedReadingTime = (expectedNumberOfWords / wpm) * 60 * 1000; // Based on the WPM, the estimated time it would take to read half of the description (in milliseconds)
  // As reading experience and time varies between students (in the sense that they might not read everything word by word),
  // we only expect that they have spent a minimum of half of the estimated reading time for reading half of the description
  // to be considered "interested" in that item
  const expectedReadingTime = estimatedReadingTime / 2;

  // Students may not necessarily start reading the description as soon as they enter the page.
  // If it is a longer description, they might spend some time skimming the page first before reading. (in milliseconds)
  const initiationTime = isLongDescriptionText ? 1500 : 500;
  return expectedReadingTime + initiationTime;
};

// Checks if the URL parameter is one of the explorer types that we're tracking
// Valid explorer types that we track are Career Goals, Courses, Interests, and Opportunities
export const isValidParameter = (parameter) => (parameter === EXPLORER_TYPE.CAREERGOALS || parameter === EXPLORER_TYPE.COURSES || parameter === EXPLORER_TYPE.INTERESTS || parameter === EXPLORER_TYPE.OPPORTUNITIES);

export const getDescriptionText = (type, slugName) => {
  const id = Slugs.findOne({ name: slugName })._id;
  switch (type) { // entityNames are the types
    case CareerGoals.getType():
      return CareerGoals.findOne({ slugID: id }).description;
    case Courses.getType():
      return Courses.findOne({ slugID: id }).description;
    case Interests.getType():
      return Interests.findOne({ slugID: id }).description;
    case Opportunities.getType():
      return Opportunities.findOne({ slugID: id }).description;
    default:
      console.error(`Bad entityName: ${type}`);
      break;
  }
  return undefined;
};
