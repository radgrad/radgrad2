import React from 'react';
import { Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink, withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { leftHandMenu } from '../shared/shared-widget-names';

interface IAdminDatabaseMenuProps {
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

const AdminDatabaseMenu = (props: IAdminDatabaseMenuProps) => {
  const username = props.currentUser;
  const baseUrl = props.match.url;
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

const AdminDatabaseMenuContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(AdminDatabaseMenu);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(AdminDatabaseMenuContainer);
