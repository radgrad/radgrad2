import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import styles from './utilities/landing-styles';
import { COLORS } from '../../utilities/Colors';

interface LandingSection2Props {
  careerGoals: string;
  interests: string;
  opportunities: string;
  users: string;
}

const whiteBG: React.CSSProperties = { backgroundColor: COLORS.WHITE, width: '100%' };
const LandingSection2: React.FC<LandingSection2Props> = ({ careerGoals, interests, opportunities, users }) => (
  <div style={whiteBG}>
    <Container>
      <div style={styles['header-section']}>
        <Grid stackable centered columns={4}>
          <Grid.Column>
            <div style={styles['landing-number-column']}>
              <span style={styles['home-number']}>{careerGoals}</span>
              <p />
              <p style={styles['home-number-label']}>
                CAREER GOALS
              </p></div>
          </Grid.Column>
          <Grid.Column>
            <div style={styles['landing-number-column']}>
              <span style={styles['home-number']}>{interests}</span>
              <p />
              <p style={styles['home-number-label']}>
                INTERESTS
              </p>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style={styles['landing-number-column']}>
              <span style={styles['home-number']}>{opportunities}</span>
              <p />
              <p style={styles['home-number-label']}>
                OPPORTUNITIES
              </p>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style={styles['landing-number-column']}>
              <span style={styles['home-number']}>
                {users}
              </span>
              <p />
              <p style={styles['home-number-label']}>
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
