import React from 'react';
import { SemanticWIDTHS } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { AdminProfiles } from '../../../api/user/AdminProfileCollection';
import FirstMenu from '../shared/FirstMenu';
import { Reviews } from '../../../api/review/ReviewCollection';
import SecondMenu from './SecondMenu';

const AdminPageMenu: React.FC = () => {
  const divStyle = { marginBottom: 30 };
  const { username } = useParams();
  const profile = AdminProfiles.getProfile(username);
  let numMod = 0;
  numMod += Reviews.find({ moderated: false }).fetch().length;
  let moderationLabel = 'Moderation';
  if (numMod > 0) {
    moderationLabel = `${moderationLabel} (${numMod})`;
  }
  const menuItems = [
    { id: 'second-menu-home', label: 'Home', route: 'home', regex: 'home' },
    { id: 'second-menu-data-model', label: 'Data Model', route: 'datamodel', regex: 'datamodel' },
    { id: 'second-menu-data-base', label: 'Data Base', route: 'database', regex: 'database' },
    { id: 'second-menu-moderation', label: moderationLabel, route: 'manage-reviews', regex: 'moderation' },
    { id: 'second-menu-analytics', label: 'Analytics', route: 'analytics', regex: 'analytics' },
    { id: 'second-menu-scoreboard', label: 'Scoreboard', route: 'scoreboard', regex: 'scoreboard' },
  ];
  const instanceName = Meteor.settings.public.instanceName;
  return (
    <div style={divStyle}>
      <FirstMenu profile={profile} displayLevelAndIce={false} instanceName={instanceName} />
      <SecondMenu menuItems={menuItems} numItems={menuItems.length as SemanticWIDTHS} />
    </div>
  );
};

export default AdminPageMenu;
