import React from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';

const AdminDatabaseMenu: React.FC = () => {
  const { username } = useParams();
  const baseUrl = useRouteMatch().url;
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/database/`;

  return (
    <Menu vertical text id="leftHandMenu">
      <Menu.Item as={NavLink} exact to={`${baseRoute}integrity-check`}>Integrity Check</Menu.Item>
      <Menu.Item as={NavLink} exact to={`${baseRoute}dump`}>Dump DB</Menu.Item>
    </Menu>
  );
};

export default AdminDatabaseMenu;
