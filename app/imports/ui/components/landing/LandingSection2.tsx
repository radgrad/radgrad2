import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import styles from './utilities/landing-styles';

interface LandingSection2Props {
  careerGoals: string;
  interests: string;
  opportunities: string;
  users: string;
}

const whiteBG: React.CSSProperties = { backgroundColor: '#ffffff', width: '100%' };
const LandingSection2: React.FC<LandingSection2Props> = ({ careerGoals, interests, opportunities, users }) => (
  <div style={whiteBG}>
    <Container>
      <div style={styles['header-section']}>
        <Grid stackable centered>
          <Grid.Column width={4}>
            <div style={styles['landing-number-column']}>
              <span style={styles['home-number']}>{careerGoals}</span>
              <p />
              <p style={styles['home-number-label']}>
                CAREER GOALS
              </p></div>
          </Grid.Column>
          <Grid.Column width={4}>
            <div style={styles['landing-number-column']}>
              <span style={styles['home-number']}>{interests}</span>
              <p />
              <p style={styles['home-number-label']}>
                INTERESTS
              </p>
            </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <div style={styles['landing-number-column']}>
              <span style={styles['home-number']}>{opportunities}</span>
              <p />
              <p style={styles['home-number-label']}>
                OPPORTUNITIES
              </p>
            </div>
          </Grid.Column>
          <Grid.Column style={styles['float-left']} width={4}>
            <div style={styles['landing-number-column']}>
              <span style={styles['home-number']}>
              {users}
            </span>
              <p />
              <p style={styles['home-number-label-last']}>
                STUDENTS, FACULTY, ALUMNI
              </p>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    </Container>
  </div>
);

export default LandingSection2;
