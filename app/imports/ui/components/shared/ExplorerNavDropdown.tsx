import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import * as Router from './RouterHelperFunctions';
import { selectExplorerMenu } from './e2e-component-names';

interface IExplorerNavDropdownProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params?: {
      username: string;
    }
  };
  text: string;
}

const ExplorerNavDropdown = (props: IExplorerNavDropdownProps) => {
  const menuItems = [
    { key: 'Academic Plans', route: EXPLORER_TYPE.ACADEMICPLANS },
    { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS },
    { key: 'Courses', route: EXPLORER_TYPE.COURSES },
    { key: 'Degrees', route: EXPLORER_TYPE.DEGREES },
    { key: 'Interests', route: EXPLORER_TYPE.INTERESTS },
    { key: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES },
    { key: 'Users', route: EXPLORER_TYPE.USERS },
  ];

  const menuOptions = menuItems.map((item) => ({
    key: item.key,
    text: item.key,
    as: NavLink,
    exact: true,
    to: Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${item.route}`),
    style: { textDecoration: 'none' },
  }));
  return (
    <Dropdown selection fluid options={menuOptions} text={props.text} id={`${selectExplorerMenu}`} />
  );
};

export default ExplorerNavDropdown;
