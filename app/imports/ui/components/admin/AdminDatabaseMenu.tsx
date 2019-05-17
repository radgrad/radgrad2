import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink, withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

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

class AdminDatabaseMenu extends React.Component<IAdminDatabaseMenuProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/database/`;
    // console.log(this.props, baseRoute);

    return (
      <Menu vertical={true}>
        <Menu.Item as={NavLink} exact={true} to={`${baseRoute}integrity-check`}>Integrity Check</Menu.Item>
        <Menu.Item as={NavLink} exact={true} to={`${baseRoute}dump`}>Dump DB</Menu.Item>
      </Menu>
    );
  }
}

const AdminDatabaseMenuContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(AdminDatabaseMenu);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(AdminDatabaseMenuContainer);
