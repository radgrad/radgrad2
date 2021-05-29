import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { COLORS } from '../../utilities/Colors';

const LandingSectionPreRelease: React.FC = () => (
  <div id="landing-section-prerelease" style={{ backgroundColor: COLORS.RED, height: '200' }}>
    <Container textAlign='center' style={{ padding: '30px' }}>
      <Header as='h1'>Warning</Header>
      <Header as='h3'>This version of RadGrad is currently in pre-release and is not intended for public use.</Header>
      <Header as='h3'>We anticipate public release in Fall, 2021.</Header>
    </Container>
  </div>
);

export default LandingSectionPreRelease;
