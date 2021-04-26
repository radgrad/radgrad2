import {
  CareerGoal,
  Course,
  Interest,
  Opportunity,
  ProfileCareerGoal, ProfileInterest,
  StudentProfile,
} from '../../../../typings/radgrad';

export interface AdvisorManageStudentsProps {
  students: StudentProfile[];
  alumni: StudentProfile[];
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  profileCareerGoals: ProfileCareerGoal[];
  profileInterests: ProfileInterest[];
}
