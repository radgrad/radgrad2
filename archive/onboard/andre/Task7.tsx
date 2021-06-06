import React, { useState } from 'react';
import { Tab, Modal, Button } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';
import { Courses } from '../../../app/imports/api/course/CourseCollection';
import { Interests } from '../../../app/imports/api/interest/InterestCollection';
import { Course, Interest } from '../../../app/imports/typings/radgrad';
import CourseLabel from '../../../app/imports/ui/components/shared/label/CourseLabel';
import InterestLabel from '../../../app/imports/ui/components/shared/label/InterestLabel';
import Task3Segment from './Task3';
import Task1Segment from './Task1';

interface TabbedProps {
  courses: Course[];
  interests: Interest[];
}
const Task7Segment: React.FC<TabbedProps> = ({ courses, interests }) => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const [open, setOpen] = useState(false);
  const panes = [
    { menuItem: 'Courses', render: () => <Tab.Pane>{courses.map((course) => <CourseLabel key={course._id} slug={course.slugID} userID={currentUser} size='small'/>)}</Tab.Pane> },
    { menuItem: 'Interests', render: () => <Tab.Pane>{interests.map((interest) => <InterestLabel key={interest._id} slug={interest.slugID} userID={currentUser} size='small'/>)}</Tab.Pane> },
    { menuItem: 'Task 1', render: () => <Tab.Pane>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button className='mini basic green'>Hello World</Button>}
      >
        <Modal.Content>
          <Task1Segment/>
          <Button color='red' onClick={() => setOpen(false)}>
              Close
          </Button>
        </Modal.Content>
      </Modal>
    </Tab.Pane> },
    { menuItem: 'Task 3', render: () => <Tab.Pane>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button className='mini basic green'>A Random Career Goal</Button>}
      >
        <Modal.Content>
          <Task3Segment/>
          <Button color='red' onClick={() => setOpen(false)}>
              Close
          </Button>
        </Modal.Content>
      </Modal>
    </Tab.Pane> },
  ];
  return (
    <RadGradSegment header={<RadGradHeader dividing title='Task 7: Tabbed and Modal Components' icon='folder plus'/>}>
      <Tab panes={panes}/>
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  return {
    courses,
    interests,
  };
})(Task7Segment);