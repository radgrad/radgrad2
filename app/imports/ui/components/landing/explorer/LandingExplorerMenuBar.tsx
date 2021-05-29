import { Meteor } from 'meteor/meteor';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown, Header, Image, Menu } from 'semantic-ui-react';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
import RadGradLogoText from '../../shared/RadGradLogoText';
import RadGradLoginButtons from '../RadGradLoginButtons';

const LandingExplorerMenuBar: React.FC = () => {
  const imageStyle = { width: '45px' };
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const instanceName = Meteor.settings.public.instanceName;
  return (
    <Menu attached="top" borderless size="small">
      <Menu.Item id={COMPONENTIDS.LANDING_EXPLORER_MENU} as={NavLink} activeClassName="" exact to="/">
        <Image style={imageStyle} circular src="/images/radgrad_logo.png" />
        <div className="mobile hidden item">
          <Header as="h2">
            <RadGradLogoText instanceName={instanceName} />
          </Header>
        </div>
      </Menu.Item>
      <Menu.Item position="right">
        {currentUser === '' ? (
          <div>
            <RadGradLoginButtons instanceName={instanceName} size="medium" />
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
