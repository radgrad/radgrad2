import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Header, Image, Menu } from 'semantic-ui-react';
import RadGradLoginButtons from '../../components/landing/RadGradLoginButtons';
import RadGradLogoText from '../../components/shared/RadGradLogoText';

interface INavBarProps {
  currentUser: string;
}

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class FirstMenu extends React.Component<INavBarProps, object> {

  public render() {
    const menuStyle = { marginBottom: '10px' };
    const radStyle = { fontWeight: 700 };
    const gradStyle = { fontWeight: 400 };
    const imageStyle = { width: '50px' };
    return (
      <Menu style={menuStyle} attached="top" borderless={true}>
        <Menu.Item as={NavLink} activeClassName="" exact={true} to="/">
          <Image style={imageStyle} circular={true} src="/images/radgrad_logo.png"/>
          <div className="mobile hidden item">
            <RadGradLogoText/>
          </div>
        </Menu.Item>

        <Menu.Item position="right">
          {this.props.currentUser === '' ? (
            <Dropdown text="Login" pointing="top right" icon={'user'}>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact={true} to="/signin"/>
                <Dropdown.Item icon="add user" text="Sign Up" as={NavLink} exact={true} to="/signup"/>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Dropdown text={this.props.currentUser} pointing="top right" icon={'user'}>
              <Dropdown.Menu>
                <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact={true} to="/signout"/>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Menu.Item>
      </Menu>
    );
  }
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const FirstMenuContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(FirstMenu);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(FirstMenuContainer);
