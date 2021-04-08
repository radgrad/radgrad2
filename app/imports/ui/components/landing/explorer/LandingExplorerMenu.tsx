import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import { getRouteName } from '../utilities/helper-functions';

const LandingExplorerMenu: React.FC = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const fullPath = `${match.path}`;
  const pathBack = fullPath.substring(0, fullPath.lastIndexOf('/'));
  const backButtonStyle = { marginTop: '5px' };
  return (
    <Button as={Link} to={pathBack} style={backButtonStyle}>
      <Icon name="chevron circle left"/>
      <br/>
      Back to {getRouteName(location.pathname)}
    </Button>
  );
};

export default LandingExplorerMenu;
