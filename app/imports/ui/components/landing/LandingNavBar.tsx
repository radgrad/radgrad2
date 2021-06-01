import React from 'react';
import { NavLink } from 'react-router-dom';
import { BrowserView } from 'react-device-detect';
import { Button, Header, Image, Menu } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';
import RadGradLoginButtons from './RadGradLoginButtons';
import { COLORS } from '../../utilities/Colors';

export interface NavBarProps {
  currentUser: string;
  iconName?: string;
  role?: string;
  instanceName: string;
}

/**
 * LandingNavBar rendered on each of the landing pages.
 */
const LandingNavBar: React.FC<NavBarProps> = ({ currentUser, iconName, role, instanceName }) => {
  const imageStyle = { width: 45 };
  let url = `/#/${role}/${currentUser}/home`;
  if (!role) {
    url = '/#/';
  }
  // Capitalize first letter
  const displayRole = currentUser && role ? role.charAt(0).toUpperCase() + role.slice(1) : '';
  return (
    <Menu attached="top" borderless size="small" >
      <Menu.Item as={NavLink} activeClassName="" exact to="/">
        <Image style={imageStyle} circular src="/images/radgrad_logo.png" />
        <BrowserView>
          <Header as="h2">
            <RadGradLogoText instanceName={instanceName} />
          </Header>
        </BrowserView>
      </Menu.Item>
      <Menu.Item position="right">
        {currentUser ? (
          <div>
            <Button basic compact style={{ color:COLORS.GREEN }}>
              <a href={url}>{displayRole} Home</a>
            </Button>
          </div>
        ) : (
          <RadGradLoginButtons instanceName={instanceName} size="medium" />
        )}
      </Menu.Item>
    </Menu>
  );
};

export default LandingNavBar;
