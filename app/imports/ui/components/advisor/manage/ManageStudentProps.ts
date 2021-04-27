import {
  CareerGoal,
  Course,
  Interest,
  Opportunity,
  ProfileCareerGoal, ProfileInterest,
  StudentProfile,
} from '../../../../typings/radgrad';

export interface ManageStudentProps {
  student: StudentProfile;
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  profileCareerGoals: ProfileCareerGoal[];
  profileInterests: ProfileInterest[];
}
