import React from 'react';
import { Modal, Button, SemanticSIZES } from 'semantic-ui-react';
import { Users } from '../../../../api/user/UserCollection';
import { ROLE } from '../../../../api/role/Role';
import ProfileLabel from './ProfileLabel';
import UserProfileCard from './UserProfileCard';

export interface UserLabelProps {
  username: string;
  size?: SemanticSIZES;
}

const UserLabel: React.FC<UserLabelProps> = ({ username, size = 'large' }) => {
  const name = Users.getFullName(username);
  const profile = Users.getProfile(username);
  const isStudent = (profile.role === ROLE.STUDENT);
  const sharePicture = profile.sharePicture || !isStudent;
  const shareLevel = isStudent && profile.shareLevel;
  const [open, setOpen] = React.useState(false);
  return (
    <Modal size='small'
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button style={{ margin: '2px', padding: '0px' }}>
          <ProfileLabel name={name} key={name} image={sharePicture && profile.picture}
            level={shareLevel && profile.level} size={size} />
        </Button>}
    >
      <Modal.Content>
        <UserProfileCard username={username} fluid />
      </Modal.Content>
      <Modal.Actions>
        <Button color='green' onClick={() => setOpen(false)}>OK</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UserLabel;
