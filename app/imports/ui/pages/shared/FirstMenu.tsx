import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Header, Image, Menu } from 'semantic-ui-react';
import RadGradLogoText from '../../components/shared/RadGradLogoText';
import RadGradMenuProfile from '../../components/shared/RadGradMenuProfile';

interface IFirstMenuProps {
  currentUser: string;
  iconName: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class FirstMenu extends React.Component<IFirstMenuProps> {

  public render() {
    const username = this.props.match.params.username;
    const imageStyle = { width: '50px' };
    const signoutStyle = { marginTop: '32px' };
    const flexStyle = { display: 'flex' };
    return (
      <Menu attached="top" borderless={true}>
        <Menu.Item as={NavLink} activeClassName="" exact={true} to="/">
          <Image style={imageStyle} circular={true} src="/images/radgrad_logo.png"/>
          <div className="mobile hidden item">
            <Header as="h2">
              <RadGradLogoText/>
            </Header>
          </div>
        </Menu.Item>

        <Menu.Item position="right" className="right menu">
          {this.props.currentUser === '' ? (
            <div>
              <Dropdown text="Login" pointing="top right" icon={'user'}>
                <Dropdown.Menu>
                  <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact={true} to="/signin"/>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <div style={flexStyle}>
              <RadGradMenuProfile userName={username}/>
              <Dropdown text={this.props.currentUser} pointing="top right" icon={this.props.iconName}
                        style={signoutStyle}>
                <Dropdown.Menu>
                  <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact={true} to="/signout"/>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </Menu.Item>
      </Menu>
    );
  }
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const FirstMenuContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
  iconName: (Roles.userIsInRole(Meteor.userId(), ['ADMIN'])) ? 'user plus' : 'user',
}))(FirstMenu);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(FirstMenuContainer);
