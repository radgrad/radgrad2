import {
  CareerGoal,
  Course,
  Interest,
  Opportunity,
  ProfileCareerGoal, ProfileCourse, ProfileInterest, ProfileOpportunity,
  StudentProfile,
} from '../../../../typings/radgrad';

export interface ManageStudentProps {
  student: StudentProfile;
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  profileCareerGoals: ProfileCareerGoal[];
  profileCourses: ProfileCourse[];
  profileInterests: ProfileInterest[];
  profileOpportunities: ProfileOpportunity[];
}
