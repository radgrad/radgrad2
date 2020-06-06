import {
  ICareerGoal,
  ICourse,
  IInterest, IOpportunity,
  IPageInterestInfo,
  IPageInterestsDailySnapshot,
} from '../../../typings/radgrad';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

export interface IAggregatedDailySnapshot {
  careerGoals: IPageInterestInfo[];
  courses: IPageInterestInfo[];
  interests: IPageInterestInfo[];
  opportunities: IPageInterestInfo[];
}

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
