import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Header, Image, Menu, Container } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';
import RadGradLoginButtons from './RadGradLoginButtons';

export interface NavBarProps {
  currentUser: string;
  roleName?: string;
  role?: string;
}

const onClick = () => {
  const el = document.getElementById('landing-section-9');
  window.scrollTo(0, el.offsetTop);
};

/**
 * LandingNavBar rendered on each of the landing pages.
 */
const LandingNavBar: React.FC<NavBarProps> = ({ currentUser, roleName, role }) => {
  const imageStyle = { width: 45 };
  const url = `/#/${role}/${currentUser}/home`;
  // Capitalize first letter
  const displayRole = currentUser ? role.charAt(0).toUpperCase() + role.slice(1) : '';
  return (

    <Menu attached="top" borderless size="small">
      <Container>
        <Menu.Item as={NavLink} activeClassName="" exact to="/">
          <Image style={imageStyle} circular src="/images/radgrad_logo.png" />
          <div className="mobile hidden item">
            <Header as="h2">
              <RadGradLogoText />
            </Header>
          </div>
        </Menu.Item>
        <Menu.Item position="right"><Button onClick={onClick}>GUIDED TOURS</Button></Menu.Item>
        <Menu.Item>
          {currentUser ? (
            <div>
              <Button basic color="green" compact><a href={url}>{displayRole} Home</a></Button>
            </div>
          ) : (
            <RadGradLoginButtons />
          )}
        </Menu.Item>
      </Container>
    </Menu>

  );
};

export default LandingNavBar;
