import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tab, Modal, Button, Label } from 'semantic-ui-react';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { AdvisorProfiles } from '../../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../../api/user/FacultyProfileCollection';
import UserLabel from '../../../components/shared/profile/UserLabel';

interface OnBoardVar {
  totalStudents: [],
  totalAdvisors: [],
  totalFaculty: [],
}

const Task7: React.FC<OnBoardVar> = ({ totalAdvisors, totalFaculty, totalStudents }) => {
  const userList = (user) => {
    switch (user) {
      case totalFaculty:
        return (
        <Label.Group size="medium">
          {totalFaculty.map((faculty) => (
          <UserLabel size="small" username={faculty}  />
          ))}
        </Label.Group>
        );
      case totalAdvisors:
        return (
        <Label.Group size="medium">
          {totalAdvisors.map((advisor) => (
          <UserLabel size="small" username={advisor}  />
          ))}
        </Label.Group>
        );
      case totalStudents:
        return (
        <Label.Group size="medium">
          {totalStudents.map((student) => (
          <UserLabel size="small" username={student}  />
          ))}
        </Label.Group>
        );
      default:
        return <React.Fragment />;
    }
  };
  const [open, setOpen] = useState(false);
  const panes = [
    { menuItem: 'Faculty', render: () => <Tab.Pane>{userList(totalFaculty)}</Tab.Pane> },
    { menuItem: 'Advisors', render: () => <Tab.Pane>{userList(totalAdvisors)}</Tab.Pane> },
    { menuItem: 'Student', render: () => <Tab.Pane>{userList(totalStudents)}</Tab.Pane> },
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
