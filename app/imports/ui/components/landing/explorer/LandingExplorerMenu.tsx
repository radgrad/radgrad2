import React from 'react';
import { Dropdown, Icon, Button } from 'semantic-ui-react';
import { NavLink, withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import { getRouteName } from '../helper-functions';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';

interface ILandingExplorerMenuProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params?: {
      username: string;
    }
  };
  location: {
    pathname: string;
    search: string;
    hash: string;
    state: any;
  };
}

const LandingExplorerMenu = (props: ILandingExplorerMenuProps) => {
  const fullPath = `${props.match.path}`;
  const pathBack = fullPath.substring(0, fullPath.lastIndexOf('/'));
  const menuItems = [
    { key: 'Academic Plans', route: EXPLORER_TYPE.ACADEMICPLANS },
    { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS },
    { key: 'Courses', route: EXPLORER_TYPE.COURSES },
    { key: 'Interests', route: EXPLORER_TYPE.INTERESTS },
    { key: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES },
  ];
  const menuOptions = menuItems.map((item) => ({
    key: item.key,
    text: item.key,
    as: NavLink,
    exact: true,
    to: `/${EXPLORER_TYPE.HOME}/${item.route}`,
    style: { textDecoration: 'none' },
  }));
  const backButtonStyle = { marginTop: '5px' };

  return (
    <div>
      <Dropdown selection options={menuOptions} text={getRouteName(props.location.pathname)} />

      {_.isEmpty(props.match.params) ? '' : (
        <Button as={Link} to={pathBack} style={backButtonStyle}>
          <Icon name="chevron circle left" />
          <br />
          Back to {getRouteName(props.location.pathname)}
        </Button>
      )}
    </div>
  );
};

const LandingExplorerMenuContainer = withRouter(LandingExplorerMenu);
export default LandingExplorerMenuContainer;
