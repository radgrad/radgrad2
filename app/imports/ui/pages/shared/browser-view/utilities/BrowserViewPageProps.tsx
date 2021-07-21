import { CareerGoal, Course, Interest, Opportunity, ProfileCareerGoal, ProfileCourse, ProfileInterest, ProfileOpportunity } from '../../../../../typings/radgrad';

export interface BrowserViewPageProps {
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  profileCareerGoals: ProfileCareerGoal[];
  profileCourses: ProfileCourse[];
  profileInterests: ProfileInterest[];
  // TODO profileInternships
  profileOpportunities: ProfileOpportunity[];
}
