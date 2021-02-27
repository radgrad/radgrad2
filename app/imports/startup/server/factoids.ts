import _ from 'lodash';
import BaseCollection from '../../api/base/BaseCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Courses } from '../../api/course/CourseCollection';
import { ProfileInterests } from '../../api/user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../../api/user/profile-entries/ProfileOpportunityCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { Factoids } from '../../api/public-stats/FactoidCollection';
import { Reviews } from '../../api/review/ReviewCollection';
import { StudentProfiles } from '../../api/user/StudentProfileCollection';
import {
  InterestOrCareerGoalFactoidProps,
  LevelFactoidProps,
  OpportunityFactoidProps,
  ReviewFactoidProps,
} from '../../typings/radgrad';
import { ProfileCareerGoals } from '../../api/user/profile-entries/ProfileCareerGoalCollection';

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
  courses = _.filter(courses, (course) => _.intersection(course.interestIDs, goal.interestIDs).length > 0);
  let opportunities = Opportunities.findNonRetired({});
  opportunities = _.filter(opportunities, (opp) => _.intersection(opp.interestIDs, goal.interestIDs).length > 0);
  const factoid = {
    name: goal.name,
    description: getShortenedDescription(goal.description),
    numberOfStudents: ProfileCareerGoals.findNonRetired({ careerGoalID: goal._id }).length,
    numberOfCourses: courses.length,
    numberOfOpportunities: opportunities.length,
  };
  // console.log(factoid);
  return factoid;
};

const buildInterestFactoid = (): InterestOrCareerGoalFactoidProps => {
  const interest = getRandomDocument(Interests);
  let courses = Courses.findNonRetired();
  courses = _.filter(courses, (course) => _.includes(course.interestIDs, interest._id));
  let opportunities = Opportunities.findNonRetired({});
  opportunities = _.filter(opportunities, (opp) => _.includes(opp.interestIDs, interest._id));
  const factoid = {
    name: interest.name,
    description: getShortenedDescription(interest.description),
    numberOfStudents: ProfileInterests.findNonRetired({ interestID: interest._id }).length,
    numberOfCourses: courses.length,
    numberOfOpportunities: opportunities.length,
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
  const factoid = {
    name: opportunity.name,
    picture: opportunity.picture,
    description: getShortenedDescription(opportunity.description),
    ice: opportunity.ice,
    numberOfStudents: ProfileOpportunities.findNonRetired({ opportunityID: opportunity._id }).length,
  };
  // console.log(factoid);
  return factoid;
};

const buildReviewFactoid = (): ReviewFactoidProps => {
  const review = getRandomDocument(Reviews);
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
};

export const updateFactoids = (): boolean => {
  Factoids.updateCareerGoalFactoid(buildCareerGoalFactoid());
  Factoids.updateInterestFactoid(buildInterestFactoid());
  Factoids.updateLevelFactoid(buildLevelFactoid());
  Factoids.updateOpportunityFactoid(buildOpportunityFactoid());
  Factoids.updateReviewFactoid(buildReviewFactoid());
  return true;
};
