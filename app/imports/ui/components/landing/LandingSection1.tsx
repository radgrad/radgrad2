import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import RadGradLogoText from '../shared/RadGradLogoText';
import LandingFactoids from './LandingFactoids';
import styles from './utilities/landing-styles';

const headerStyle = { fontSize: '60px', display: 'inline' };

interface LandingSection1Props {
  instanceName: string;
  tagline: string;
}

const LandingSection1: React.FC<LandingSection1Props> = ({ instanceName, tagline}) => (
    <div id="landing-section-1" style={styles['inverted-section']}>
      <Container>
        <Grid stackable>
          <Grid.Column width={6}>
            <LandingFactoids />
          </Grid.Column>
          <Grid.Column width={10} verticalAlign="middle">
            <div style={styles['inverted-main-header']}>
              Welcome to{' '}
              <span style={styles['green-text']}>
              <RadGradLogoText style={headerStyle} instanceName={instanceName} />
            </span>
            </div>
            <span style={styles['inverted-main-description']}>
            <Markdown source={tagline} />
          </span>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
);

export default LandingSection1;
