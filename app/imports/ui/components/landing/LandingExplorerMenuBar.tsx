import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Header, Image, Menu } from 'semantic-ui-react';
import { INavBarProps } from './LandingNavBar';
import RadGradLogoText from '../shared/RadGradLogoText';
import RadGradLoginButtons from './RadGradLoginButtons';

class LandingExplorerMenuBar extends React.Component<INavBarProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const imageStyle = { width: '45px' };
    return (
      <Menu attached="top" borderless={true} size="small">
        <Menu.Item as={NavLink} activeClassName="" exact={true} to="/">
          <Image style={imageStyle} circular={true} src="/images/radgrad_logo.png"/>
          <div className="mobile hidden item">
            <Header as="h2">
              <RadGradLogoText/>
            </Header>
          </div>
        </Menu.Item>
        <Menu.Item position="right">
          {this.props.currentUser === '' ? (
            <div>
              <RadGradLoginButtons/>
              <Dropdown text="Login" pointing="top right" icon={'user'}>
                <Dropdown.Menu>
                  <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact={true} to="/signin"/>
                </Dropdown.Menu>
              </Dropdown>
            </div>
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

const LandingExplorerMenuBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(LandingExplorerMenuBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(LandingExplorerMenuBarContainer);
