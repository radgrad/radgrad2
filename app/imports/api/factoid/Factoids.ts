import _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { ProfileInterests } from '../user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../user/profile-entries/ProfileOpportunityCollection';
import { Interests } from '../interest/InterestCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { Factoids } from './FactoidCollection';
import { Reviews } from '../review/ReviewCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import {
  InterestOrCareerGoalFactoidProps,
  LevelFactoidProps,
  OpportunityFactoidProps,
  ReviewFactoidProps,
} from '../../typings/radgrad';
import { ProfileCareerGoals } from '../user/profile-entries/ProfileCareerGoalCollection';

const getRandomDocument = (collection: BaseCollection) => {
  const documents = collection.findNonRetired({});
  return documents[Math.floor(Math.random() * documents.length)];
};

const getShortenedDescription = (description: string) => {
  let ret = description;
  if (ret.length > 150) {
    ret = ret.substring(0, 150);
    ret = `${ret.substring(0, ret.lastIndexOf(' '))}...`;
  }
  return ret;
};

const buildCareerGoalFactoid = (): InterestOrCareerGoalFactoidProps => {
  const goal = getRandomDocument(CareerGoals);
  let courses = Courses.findNonRetired();
  courses = courses.filter((course) => _.intersection(course.interestIDs, goal.interestIDs).length > 0);
  let opportunities = Opportunities.findNonRetired({});
  opportunities = opportunities.filter((opp) => _.intersection(opp.interestIDs, goal.interestIDs).length > 0);
  const factoid = goal ? {
    name: goal.name,
    description: getShortenedDescription(goal.description),
    numberOfStudents: ProfileCareerGoals.findNonRetired({ careerGoalID: goal._id }).length,
    numberOfCourses: courses.length,
    numberOfOpportunities: opportunities.length,
  } : {
    name: '',
    description: '',
    numberOfCourses: 0,
    numberOfOpportunities: 0,
    numberOfStudents: 0,
  } ;
  // console.log(factoid);
  return factoid;
};

const buildInterestFactoid = (): InterestOrCareerGoalFactoidProps => {
  const interest = getRandomDocument(Interests);
  let courses = Courses.findNonRetired();
  courses = courses.filter((course) => (course.interestIDs).includes(interest._id));
  let opportunities = Opportunities.findNonRetired({});
  opportunities = opportunities.filter((opp) => (opp.interestIDs).includes( interest._id));
  const factoid = interest ? {
    name: interest.name,
    description: getShortenedDescription(interest.description),
    numberOfStudents: ProfileInterests.findNonRetired({ interestID: interest._id }).length,
    numberOfCourses: courses.length,
    numberOfOpportunities: opportunities.length,
  } : {
    name: '',
    description: '',
    numberOfCourses: 0,
    numberOfOpportunities: 0,
    numberOfStudents: 0,
  };
  // console.log(factoid);
  return factoid;
};

const buildLevelFactoid = (): LevelFactoidProps => {
  const level = Math.floor(Math.random() * 5) + 1;
  const numberOfStudents = StudentProfiles.findNonRetired({ level }).length;
  let description = '';
  switch (level) {
    case 1:
      description = 'Grasshoppers start at Level 1. Level 1 students have not completed any courses.';
      break;
    case 2:
      description = 'Level 2 students have started to plan their degree experience.';
      break;
    case 3:
      description = 'Level 3 students have completed at least three courses.';
      break;
    case 4:
      description = 'Level 4 students have completed courses and opportunities.';
      break;
    case 5:
      description = 'At Level 5, you are almost finished with the RadGrad journey!';
      break;
    default:
      description = 'Level 6 Ninjas are well prepared for high tech success.';
  }

  const factoid = {
    level,
    numberOfStudents,
    description,
  };
  // console.log(factoid);
  return factoid;
};

const buildOpportunityFactoid = (): OpportunityFactoidProps => {
  const opportunity = getRandomDocument(Opportunities);
  const factoid = opportunity ? {
    name: opportunity.name,
    picture: opportunity.picture,
    description: getShortenedDescription(opportunity.description),
    ice: opportunity.ice,
    numberOfStudents: ProfileOpportunities.findNonRetired({ opportunityID: opportunity._id }).length,
  } : {
    name: '',
    picture: '',
    description: '',
    ice: { i : 0, c : 0, e : 0 },
    numberOfStudents: 0,
  };
  // console.log(factoid);
  return factoid;
};

const buildReviewFactoid = (): ReviewFactoidProps => {
  const review = getRandomDocument(Reviews);
  if (review) {
    let name = '';
    if (review.reviewType === Reviews.COURSE) {
      name = `Course: ${Courses.findDoc(review.revieweeID).name}`;
    } else {
      name = Opportunities.findDoc(review.revieweeID).name;
    }
    const description = getShortenedDescription(review.comments);
    const factoid = {
      name,
      description,
    };
    // console.log(factoid);
    return factoid;
  }
  return {
    name: '',
    description: '',
  };
};

export const updateFactoids = (): boolean => {
  Factoids.updateCareerGoalFactoid(buildCareerGoalFactoid());
  Factoids.updateInterestFactoid(buildInterestFactoid());
  Factoids.updateLevelFactoid(buildLevelFactoid());
  Factoids.updateOpportunityFactoid(buildOpportunityFactoid());
  Factoids.updateReviewFactoid(buildReviewFactoid());
  return true;
};
