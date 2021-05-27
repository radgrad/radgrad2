import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { CareerGoal, Course, Interest, Opportunity, StudentProfile } from '../../../../typings/radgrad';
import CareerGoalLabel from '../../../components/shared/label/CareerGoalLabel';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import UserLabel from '../../../components/shared/profile/UserLabel';
import OpportunityLabel from '../../../components/shared/label/OpportunityLabel';
import InterestLabel from '../../../components/shared/label/InterestLabel';
import CourseLabel from '../../../components/shared/label/CourseLabel';

interface Task4Props {
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  students: StudentProfile[];
}

const Task4: React.FC<Task4Props> = ({ careerGoals, courses, opportunities, interests, students }) => {
  const header = <RadGradHeader title="TASK 4: LABELS" icon="tags"/>;
  return (
        <RadGradSegment header={header}>
            <h3>Career Goals</h3>
            {careerGoals.map((goal) => (
                <CareerGoalLabel slug={Slugs.getNameFromID(goal.slugID)}/>
            ))}
            <h3>Courses</h3>
            {courses.map((course) => (
                <CourseLabel slug={Slugs.getNameFromID(course.slugID)}/>
            ))}
            <h3>Interests</h3>
            {interests.map((interest) => (
                <InterestLabel slug={Slugs.getNameFromID(interest.slugID)}/>
            ))}
            <h3>Opportunities</h3>
            {opportunities.map((opportunity) => (
                <OpportunityLabel slug={Slugs.getNameFromID(opportunity.slugID)}/>
            ))}
            <h3>Students</h3>
            {students.map((student) => (
                <UserLabel username={student.username} size='small'/>
            ))}
        </RadGradSegment>
  );
};
export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  const opportunities = Opportunities.findNonRetired();
  const students = StudentProfiles.findNonRetired({ isAlumni: false });
  return { careerGoals, courses, interests, opportunities, students };
})(Task4);
