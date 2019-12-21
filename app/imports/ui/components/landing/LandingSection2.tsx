import * as React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import RadGradLogoTextQ from '../shared/RadGradLogoTextQ';
import styles from './landing-styles';

interface ILandingSection2Props {
  careerGoals: string;
  interests: string;
  opportunities: string;
  users: string;
}

const noMarginTopStyle = { marginTop: '0px' };

const LandingSection2 = (props: ILandingSection2Props) => (
  <div style={styles['header-section']}>
    <Grid stackable>
      <Grid.Column width={3} />
      <Grid.Column width={5} textAlign="right">
        <Header as="h1" style={styles['header-text']}>
Why use
          <RadGradLogoTextQ />
        </Header>
        <p style={styles['header-description']}>
          <b>Discover</b>
          {' '}
your interests.
          <br />
          <b>Build</b>
          {' '}
your community.
          <br />
          <b>Strengthen</b>
          {' '}
your preparation.
          <br />
          <b>Define</b>
, then
          <b>achieve</b>
          {' '}
your career goals.
          <br />
          <b>Pay it forward.</b>
          {' '}
          <br />
        </p>
      </Grid.Column>
      <Grid.Column width={5} verticalAlign="middle">
        <div className="ui huge horizontal statistics landing-stats" style={noMarginTopStyle}>
          <div className="green statistic" style={styles['landing-stats > .statistic']}>
            <div className="value">
              {props.careerGoals}
            </div>
            <div className="label">
              <a href="#/explorer/career-goals">Career Goals</a>
            </div>
          </div>
          <div className="green statistic">
            <div className="value">
              {props.interests}
            </div>
            <div className="label">
              <a href="#/explorer/interests">Interests</a>
            </div>
          </div>
          <div className="green statistic">
            <div className="value">
              {props.opportunities}
            </div>
            <div className="label">
              <a href="#/explorer/opportunities">Opportunities</a>
            </div>
          </div>
          <div className="green statistic">
            <div className="value">
              {props.users}
            </div>
            <div className="label">
              Students, Faculty, Mentors, Alumni
            </div>
          </div>
        </div>
      </Grid.Column>
      <Grid.Column width={3} />
    </Grid>
  </div>
);

export default LandingSection2;
