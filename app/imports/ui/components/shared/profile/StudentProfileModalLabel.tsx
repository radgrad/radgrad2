import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import {StudentProfile} from '../../../../typings/radgrad';
import StudentProfileLabel from './StudentProfileLabel';
import StudentProfileCard from './StudentProfileCard';

export interface StudentProfileModalLabelProps {
  studentProfile: StudentProfile;
}

const StudentProfileModalLabel: React.FC<StudentProfileModalLabelProps> = ({studentProfile}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Modal size='tiny'
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button style={{margin: '0px', padding: '0px'}}><StudentProfileLabel studentProfile={studentProfile}/></Button>}
    >
      <Modal.Content>
          <StudentProfileCard studentProfile={studentProfile} fluid/>
      </Modal.Content>
      <Modal.Actions>
        <Button color='green' onClick={() => setOpen(false)}>OK</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default StudentProfileModalLabel;
