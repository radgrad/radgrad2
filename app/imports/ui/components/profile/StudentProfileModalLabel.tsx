import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import {StudentProfile} from '../../../typings/radgrad';
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
          <StudentProfileCard studentProfile={studentProfile}/>
      </Modal.Content>
      <Modal.Actions>
        <Button color='green' onClick={() => setOpen(false)}>OK</Button>
      </Modal.Actions>
    </Modal>
  );
};

const StudentProfileModalLabel2: React.FC<StudentProfileModalLabelProps> = ({studentProfile}) => {
  return (
    <Modal size='tiny'
      trigger={<Button style={{margin: '0px', padding: '0px'}}><StudentProfileLabel studentProfile={studentProfile}/></Button>}
      content={<StudentProfileCard studentProfile={studentProfile}/>}
      actions={['Snooze', { key: 'done', content: 'Done', positive: true }]}
    />
  );
};


export default StudentProfileModalLabel;