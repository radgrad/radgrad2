import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import {
  InterestOrCareerGoalFactoidProps,
  LevelFactoidProps,
  OpportunityFactoidProps,
  ReviewFactoidProps,
} from '../../../typings/radgrad';
import RadGradLogoText from '../shared/RadGradLogoText';
import LandingFactoids from './LandingFactoids';
import styles from './utilities/landing-styles';

const headerStyle = { fontSize: '60px', display: 'inline' };

interface LandingSection1Props {
  instanceName: string;
  tagline: string;
  careerGoalFactoid: InterestOrCareerGoalFactoidProps,
  interestFactoid: InterestOrCareerGoalFactoidProps,
  levelFactoid: LevelFactoidProps,
  opportunityFactoid: OpportunityFactoidProps,
  reviewFactoid: ReviewFactoidProps,
}

const LandingSection1: React.FC<LandingSection1Props> = ({ instanceName, tagline, careerGoalFactoid, interestFactoid, levelFactoid, opportunityFactoid, reviewFactoid }) => (
  <div id="landing-section-1" style={styles['inverted-section']}>
    <Container>
      <Grid stackable columns='equal' style={{ height: '300px' }}>
        <Grid.Column only="computer">
          <LandingFactoids careerGoalFactoid={careerGoalFactoid} interestFactoid={interestFactoid} levelFactoid={levelFactoid} opportunityFactoid={opportunityFactoid} reviewFactoid={reviewFactoid} />
        </Grid.Column>
        <Grid.Column verticalAlign="middle">
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
