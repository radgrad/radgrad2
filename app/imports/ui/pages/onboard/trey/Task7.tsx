import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Tab, Modal, Button } from 'semantic-ui-react';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { CareerGoal, Course, Interest, Opportunity, StudentProfile } from '../../../../typings/radgrad';
import CareerGoalLabel from '../../../components/shared/label/CareerGoalLabel';
import CourseLabel from '../../../components/shared/label/CourseLabel';
import InterestLabel from '../../../components/shared/label/InterestLabel';
import OpportunityLabel from '../../../components/shared/label/OpportunityLabel';
import UserLabel from '../../../components/shared/profile/UserLabel';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import Task2 from './Task2';


interface Task7Props {
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  students: StudentProfile[];
}

const Task7: React.FC<Task7Props> = ({ careerGoals, courses, interests, opportunities, students }) => {

  const currentUser = Meteor.user() ? Meteor.user()._id : '';

  const panes = [
    { menuItem: 'Career Goals', render: () => <Tab.Pane>{careerGoals.map((careerGoal) => <CareerGoalLabel key={careerGoal._id} slug={careerGoal.slugID} userID={currentUser} size='small'/>)}</Tab.Pane> },
    { menuItem: 'Courses', render: () => <Tab.Pane>{courses.map((course) => <CourseLabel key={course._id} slug={course.slugID} userID={currentUser} size='small'/>)}</Tab.Pane> },
    { menuItem: 'Interests', render: () => <Tab.Pane>{interests.map((interest) => <InterestLabel key={interest._id} slug={interest.slugID} userID={currentUser} size='small' />)}</Tab.Pane> },
    { menuItem: 'Opportunities', render: () => <Tab.Pane>{opportunities.map((opportunity) => <OpportunityLabel key={opportunity._id} slug={opportunity.slugID} userID={currentUser} size='small' />)}</Tab.Pane> },
    { menuItem: 'Students', render: () => <Tab.Pane>{students.map((student) => <UserLabel key={student._id} username={student.username} size='small' />)}</Tab.Pane> },
    { menuItem: 'Task 2', render: () => <Tab.Pane>
        <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button>Who is the user?</Button>}
      >
        <Modal.Header>Task 2</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Task2 />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={() => setOpen(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </Tab.Pane> },
  ];

  const [open, setOpen] = useState(false);

  return (
    <RadGradSegment header={<RadGradHeader title='Task 7: Tabbed and Modal Components' dividing />}>
      <Tab panes={panes} />
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  const opportunities = Opportunities.findNonRetired();
  const students = StudentProfiles.findNonRetired({ isAlumni: false });
  return {
    careerGoals,
    courses,
    interests,
    opportunities,
    students,
  };
})(Task7);