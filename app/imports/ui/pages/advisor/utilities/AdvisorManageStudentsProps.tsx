import { CareerGoal, Course, Interest, Opportunity, StudentProfile } from '../../../../typings/radgrad';

export interface AdvisorManageStudentsProps {
  students: StudentProfile[];
  alumni: StudentProfile[];
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
}
