import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tab, Modal, Button } from 'semantic-ui-react';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';
import { StudentProfiles } from '../../../app/imports/api/user/StudentProfileCollection';
import { AdvisorProfiles } from '../../../app/imports/api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../app/imports/api/user/FacultyProfileCollection';
import UserLabel from '../../../app/imports/ui/components/shared/profile/UserLabel';

interface Task7Prop {
  totalStudents: [],
  totalAdvisors: [],
  totalFaculty: [],
}

const Task7: React.FC<Task7Prop> = ({ totalAdvisors, totalFaculty, totalStudents }) => {

  const [open, setOpen] = useState(false);

  const panes = [
    { menuItem: 'Faculty', render: () => <Tab.Pane>{totalFaculty.map((faculty) => <UserLabel username={faculty} size='small' />)}</Tab.Pane> },
    { menuItem: 'Advisors', render: () => <Tab.Pane>{totalAdvisors.map((advisor) => <UserLabel username={advisor} size='small' />)}</Tab.Pane> },
    { menuItem: 'Student', render: () => <Tab.Pane>{totalStudents.map((student) => <UserLabel username={student} size='small' />)}</Tab.Pane> },
    { menuItem: 'Task 1', render: () => <Tab.Pane>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() =>  setOpen(true)}
        open={open}
        trigger={<Button>Show Modal</Button>}
      >
        <Modal.Header icon='globe americas'>TASK 1: HELLO WORLD</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>Hello World</p>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </Tab.Pane> },
  ];

  return (
    <RadGradSegment header={<RadGradHeader title='TASK 7: Tabbed and Modal components' icon='splotch'/>}>
      <Tab panes={panes} />
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const totalStudents = StudentProfiles.findNonRetired();
  const totalAdvisors = AdvisorProfiles.findNonRetired();
  const totalFaculty = FacultyProfiles.findNonRetired();
  return {
    totalStudents,
    totalAdvisors,
    totalFaculty,
  };
})(Task7);
