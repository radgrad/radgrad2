import React from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';
import { leftHandMenu } from '../../shared/shared-widget-names';

export interface IAdminDatabaseMenuProps {
  currentUser: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const AdminDatabaseMenu = () => {
  const { username } = useParams();
  const baseUrl = useRouteMatch().url;
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/database/`;
  // console.log(props, baseRoute);

  return (
    <Menu vertical text id={`${leftHandMenu}`}>
      <Menu.Item as={NavLink} exact to={`${baseRoute}integrity-check`}>Integrity Check</Menu.Item>
      <Menu.Item as={NavLink} exact to={`${baseRoute}dump`}>Dump DB</Menu.Item>
    </Menu>
  );
};

export default AdminDatabaseMenu;
