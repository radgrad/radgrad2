import { Meteor } from 'meteor/meteor';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown, Header, Image, Menu } from 'semantic-ui-react';
import RadGradLogoText from '../../shared/RadGradLogoText';
import RadGradLoginButtons from '../RadGradLoginButtons';

const LandingExplorerMenuBar = () => {
  const imageStyle = { width: '45px' };
  const menuStyle = { marginBottom: 30 };
  const currentUser = Meteor.user() ? Meteor.user().username : '';
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
        {currentUser === '' ? (
          <div>
            <RadGradLoginButtons />
          </div>
        ) : (
          <Dropdown text={currentUser} pointing="top right" icon="user">
            <Dropdown.Menu>
              <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" />
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Menu.Item>
    </Menu>
  );
};

export default LandingExplorerMenuBar;
