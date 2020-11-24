import React from 'react';
import FirstMenuContainer from '../shared/FirstMenu';
import { Reviews } from '../../../api/review/ReviewCollection';
import SecondMenu from './SecondMenu';

/** A simple static component to render some text for the landing page. */
const AdminPageMenuWidget = () => {
  const divStyle = { marginBottom: 30 };
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
    { id: 'second-menu-moderation', label: moderationLabel, route: 'moderation', regex: 'moderation' },
    { id: 'second-menu-analytics', label: 'Analytics', route: 'analytics', regex: 'analytics' },
    { id: 'second-menu-scoreboard', label: 'Scoreboard', route: 'scoreboard', regex: 'scoreboard' },
  ];
  return (
    <div style={divStyle}>
      <FirstMenuContainer />
      <SecondMenu menuItems={menuItems} numItems={menuItems.length} />
    </div>
  );
};

export default AdminPageMenuWidget;
