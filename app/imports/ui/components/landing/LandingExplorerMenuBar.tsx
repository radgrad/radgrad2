import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Header, Image, Menu } from 'semantic-ui-react';
import { INavBarProps } from './LandingNavBar';
import RadGradLogoText from '../shared/RadGradLogoText';
import RadGradLoginButtons from './RadGradLoginButtons';

const LandingExplorerMenuBar = (props: INavBarProps) => {
  const imageStyle = { width: '45px' };
  const menuStyle = { marginBottom: 30 };

  return (
    <Menu style={menuStyle} attached="top" borderless size="small">
      <Menu.Item as={NavLink} activeClassName="" exact to="/">
        <Image style={imageStyle} circular src="/images/radgrad_logo.png" />
        <div className="mobile hidden item">
          <Header as="h2">
            <RadGradLogoText />
          </Header>
        </div>
      </Menu.Item>
      <Menu.Item position="right">
        {props.currentUser === '' ? (
          <div>
            <RadGradLoginButtons />
          </div>
        ) : (
          <Dropdown text={props.currentUser} pointing="top right" icon="user">
            <Dropdown.Menu>
              <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" />
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Menu.Item>
    </Menu>
  );
};

const LandingExplorerMenuBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(LandingExplorerMenuBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(LandingExplorerMenuBarContainer);
