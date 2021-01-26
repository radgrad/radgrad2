import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../utilities/router';

interface ExplorerNavDropdownProps {
  text: string;
}

const ExplorerNavDropdown: React.FC<ExplorerNavDropdownProps> = ({ text }) => {
  const menuItems = [
    { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS },
    { key: 'Courses', route: EXPLORER_TYPE.COURSES },
    { key: 'Interests', route: EXPLORER_TYPE.INTERESTS },
    { key: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES },
  ];
  const match = useRouteMatch();
  const menuOptions = menuItems.map((item) => ({
    key: item.key,
    text: item.key,
    as: NavLink,
    exact: true,
    to: Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${item.route}`),
    style: { textDecoration: 'none' },
  }));
  return <Dropdown selection fluid options={menuOptions} text={text} id="selectExplorerMenu" />;
};

export default ExplorerNavDropdown;
