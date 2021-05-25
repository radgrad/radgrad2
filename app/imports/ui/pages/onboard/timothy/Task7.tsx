import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tab, Modal, Button } from 'semantic-ui-react';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { AdvisorProfiles } from '../../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../../api/user/FacultyProfileCollection';
import UserLabel from '../../../components/shared/profile/UserLabel';

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
  ];

  return (
  <RadGradSegment header={<RadGradHeader title='TASK 7: Tabbed and Modal components' icon='splotch'/>}>
    <Tab panes={panes} />
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
