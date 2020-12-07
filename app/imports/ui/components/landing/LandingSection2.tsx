import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import styles from './utilities/landing-styles';

interface ILandingSection2Props {
  careerGoals: string;
  interests: string;
  opportunities: string;
  users: string;
}

const whiteBG: React.CSSProperties = { backgroundColor: '#ffffff', width: '100%' };
const LandingSection2: React.FC<ILandingSection2Props> = ({ careerGoals, interests, opportunities, users }) => (
  <div style={whiteBG}>
    <Container>
      <div style={styles['header-section']}>
        <Grid stackable>

          <Grid.Column width={4}>
            <span style={styles['home-number']}>
              {careerGoals}
            </span>
            <span style={styles['home-number-label']}><a id="landing-career-goals-link" style={{ fontWeight: 'normal' }} href="#/explorer/career-goals">CAREER GOALS</a>
            </span>
          </Grid.Column>
          <Grid.Column width={4}>
            <span style={styles['home-number']}>
              {interests}
            </span>
            <span style={styles['home-number-label']}><a id="landing-interests-link" style={{ fontWeight: 'normal' }} href="#/explorer/interests">INTERESTS</a>
            </span>
          </Grid.Column>
          <Grid.Column width={4}>
            <span style={styles['home-number']}>
              {opportunities}
            </span>
            <span style={styles['home-number-label']}><a id="landing-opportunities-link" style={{ fontWeight: 'normal' }} href="#/explorer/opportunities">OPPORTUNITIES</a>
            </span>
          </Grid.Column>
          <Grid.Column style={styles['float-left']} width={4}>
            <div style={styles['home-number']}>
              <span style={styles['float-left']}>{users}</span>
            </div>
            <div style={styles['home-number-label-last']}>
              STUDENTS, FACULTY,<br />
              ALUMNI</div>
          </Grid.Column>
        </Grid>
      </div>
    </Container>
  </div>
);

export default LandingSection2;
