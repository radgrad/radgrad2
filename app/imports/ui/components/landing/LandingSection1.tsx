import React from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';
import styles from './utilities/landing-styles';

const headerStyle = { fontSize: '60px', display: 'inline' };

const LandingSection1 = () => (
  <div id="landing-section-1" style={styles['inverted-section']}>
    <Container>
      <Grid stackable>
        <Grid.Column width={6}>
          <Image src="/images/landing/card_animation.gif" centered />
        </Grid.Column>
        <Grid.Column width={10} verticalAlign="middle">
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
