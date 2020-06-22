
import React from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';
import styles from './landing-styles';

const headerStyle = { fontSize: '60px', display: 'inline' };

const LandingSection1 = () => (
  <div id="landing-section-1" style={styles['inverted-section']}>
    <Container>
      <Grid>
        <Grid.Column width={5}>
          <Image src="/images/landing/card_animation.gif" style={styles['float-right']} verticalAlign="middle" />
        </Grid.Column>
        <Grid.Column width={11}>
          <div style={styles['inverted-main-header']}>
            Welcome to <span style={styles['green-text']}><RadGradLogoText style={headerStyle} /></span>
          </div>
          <span style={styles['inverted-main-description']}>
            Developing awesome computer scientists, <b>ONE</b> graduate at a time.
          </span>
        </Grid.Column>
      </Grid>
    </Container>
  </div>
);

export default LandingSection1;
