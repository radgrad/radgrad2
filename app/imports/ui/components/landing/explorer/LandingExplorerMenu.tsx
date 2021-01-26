import React from 'react';
import { Dropdown, Icon, Button } from 'semantic-ui-react';
import { NavLink, Link, useLocation, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { getRouteName } from '../utilities/helper-functions';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';

const LandingExplorerMenu: React.FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const fullPath = `${match.path}`;
  const pathBack = fullPath.substring(0, fullPath.lastIndexOf('/'));
  const menuItems = [
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
      <Dropdown selection options={menuOptions} text={getRouteName(location.pathname)} />

      {_.isEmpty(match.params) ? (
        ''
      ) : (
        <Button as={Link} to={pathBack} style={backButtonStyle}>
          <Icon name="chevron circle left" />
          <br />
          Back to {getRouteName(location.pathname)}
        </Button>
      )}
    </div>
  );
};

export default LandingExplorerMenu;
