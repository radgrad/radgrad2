import React from 'react';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import SecondMenu from '../../pages/shared/SecondMenu';

const StudentPageMenuWidget = () => {
  const divStyle = { marginBottom: 30 };
  const menuItems = [
    { label: 'Home', route: 'home' },
    { label: 'Explorer', route: 'explorer' },
    { label: 'Degree Planner', route: 'degree-planner' },
    { label: 'Mentor Space', route: 'mentor-space' },
  ];
  return (
    <div style={divStyle}>
      <FirstMenuContainer />
      <SecondMenu menuItems={menuItems} numItems={menuItems.length} />
    </div>
  );
};

export default StudentPageMenuWidget;
