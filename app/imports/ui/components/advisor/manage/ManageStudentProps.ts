import { CareerGoal, Course, Interest, Opportunity, StudentProfile } from '../../../../typings/radgrad';

export interface ManageStudentProps {
  student: StudentProfile;
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
}
