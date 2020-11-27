import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Dropdown, Header, Image, Menu, Container } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import RadGradLogoText from './RadGradLogoText';
import RadGradMenuProfile from './RadGradMenuProfile';
import { getUsername, isUrlRoleStudent } from './utilities/router';
import { firstMenu } from './shared-widget-names';

/**
 * First menu for all pages.
 * @param currentUser the logged in username.
 * @param iconName the icon name for the type of user.
 * @constructor
 */
const FirstMenu: React.FunctionComponent = () => {
  const match = useRouteMatch();
  const username = getUsername(match);
  const imageStyle = { width: '50px' };
  const flexStyle = { display: 'flex' };
  const noPadding = { paddingTop: 0, paddingBottom: 0 };
  const signoutStyle = { marginTop: '32px' };
  const isStudent = isUrlRoleStudent(match);
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const iconName = (Roles.userIsInRole(Meteor.userId(), ['ADMIN'])) ? 'user plus' : 'user';
  return (
    <Container>
      <Menu attached="top" borderless className="radgrad-first-menu" id={`${firstMenu}`}>
        <Menu.Item as={NavLink} activeClassName="" exact to="/" style={noPadding}>
          <Image style={imageStyle} circular src="/images/radgrad_logo.png" />
          <div className="mobile hidden item">
            <Header as="h1" className="inline">
              <RadGradLogoText />
            </Header>
          </div>
        </Menu.Item>
        <Menu.Item position="right" className="right menu" style={noPadding}>
          {currentUser === '' ? (
            <div>
              <Dropdown text="Login" pointing="top right" icon="user">
                <Dropdown.Menu>
                  <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact to="/signin" />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <div style={flexStyle}>
              <RadGradMenuProfile userName={username} />
              {/*
                  TODO Temporary until we have a re-design of the "SecondMenu"s of non-student roles
                        See FIGMA mockup; remove this Dropdown once the above is accomplished
               */}
              {(!isStudent) ? (
                <Dropdown
                  text={currentUser}
                  id="first-menu-username"
                  pointing="top right"
                  icon={iconName}
                  style={signoutStyle}
                >
                  <Dropdown.Menu>
                    <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" />
                  </Dropdown.Menu>
                </Dropdown>
              ) : ''}
              {/* END */}
            </div>
          )}
        </Menu.Item>
      </Menu>
    </Container>
  );
};

export default FirstMenu;
