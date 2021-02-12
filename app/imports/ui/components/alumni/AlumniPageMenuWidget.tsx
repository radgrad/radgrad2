import React from 'react';
import { useParams } from 'react-router-dom';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import FirstMenuContainer from '../shared/FirstMenu';

const divStyle = { marginBottom: 30 };

const AlumniPageMenuWidget: React.FC = () => {
  const { username } = useParams();
  const profile = StudentProfiles.getProfile(username);
  const instanceName = Meteor.settings.public.instanceName;
  return (
    <div style={divStyle}>
      <FirstMenuContainer profile={profile} displayLevelAndIce={false} instanceName={instanceName} />
    </div>
  );
};

export default AlumniPageMenuWidget;
