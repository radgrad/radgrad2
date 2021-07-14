import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown, Header, Image, Menu } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { COMPONENTIDS } from '../../utilities/ComponentIDs';
import RadGradLogoText from './RadGradLogoText';
import RadGradMenuProfile, { RadGradMenuProfileProps } from './RadGradMenuProfile';

interface FirstMenuProps extends RadGradMenuProfileProps {
  instanceName: string;
}

/**
 * First menu for all profiles.
 * @param profile the user's profile.
 * @param displayLevelAndIce do we show leve and ice?
 * @param earnedICE the earned ICE points.
 * @param projectedICE the planned ICE points.
 * @constructor
 */
const FirstMenu: React.FC<FirstMenuProps> = ({ profile, displayLevelAndIce, earnedICE, projectedICE, instanceName }) => {
  const imageStyle = { width: '50px' };
  const flexStyle = { display: 'flex' };
  const noPadding = { paddingTop: 0, paddingBottom: 0 };
  const signoutStyle = { marginTop: '32px' };
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  let userString;
  if (profile.username !== currentUser) {
    userString = `${profile.username} : ${currentUser}`;
  } else {
    userString = currentUser;
  }
  return (
    <Menu attached="top" borderless className="radgrad-first-menu" id="firstMenu">
      <Menu.Item as={NavLink} activeClassName="" exact to="/" style={noPadding}>
        <Image style={imageStyle} circular src="/images/radgrad_logo.png" />
        <div className="mobile hidden item">
          <Header as="h1" className="inline">
            <RadGradLogoText instanceName={instanceName} />
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
            <RadGradMenuProfile profile={profile} displayLevelAndIce={displayLevelAndIce} projectedICE={projectedICE}
              earnedICE={earnedICE} />
            <Dropdown text={userString} id={COMPONENTIDS.FIRST_MENU_USERNAME} pointing="top right" icon="caret down"
              style={signoutStyle}>
              <Dropdown.Menu>
                <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </Menu.Item>
    </Menu>
  );
};

export default FirstMenu;
