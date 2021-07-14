import { CareerGoals } from '../../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../../api/course/CourseCollection';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import { ProfileCareerGoals } from '../../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from '../../../../../api/user/profile-entries/ProfileCourseCollection';
import { ProfileInterests } from '../../../../../api/user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../../../../../api/user/profile-entries/ProfileOpportunityCollection';
import * as Router from '../../../../components/shared/utilities/router';

export const getEntities = (match) => {
  const userID = Router.getUserIdFromRoute(match);
  const profileCareerGoals = ProfileCareerGoals.findNonRetired({ userID });
  const profileCourses = ProfileCourses.findNonRetired({ userID });
  const profileInterests = ProfileInterests.findNonRetired({ userID });
  const profileOpportunities = ProfileOpportunities.findNonRetired({ userID });
  const careerGoals = CareerGoals.findNonRetired();
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  const opportunities = Opportunities.findNonRetired();
  return {
    careerGoals,
    courses,
    interests,
    opportunities,
    profileCareerGoals,
    profileCourses,
    profileInterests,
    profileOpportunities,
  };
};
