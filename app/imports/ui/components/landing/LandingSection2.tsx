import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import styles from './landing-styles';

interface ILandingSection2Props {
    careerGoals: string;
    interests: string;
    opportunities: string;
    users: string;
}

const whiteBG: React.CSSProperties = { backgroundColor: '#ffffff', width: '100%' };
const LandingSection2 = (props: ILandingSection2Props) => (
  <div style={whiteBG}>
    <Container>
      <div style={styles['header-section']}>
        <Grid stackable>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
            <span style={styles['home-number']}>
              {props.careerGoals}
            </span>
            <span style={styles['home-number-label']}>CAREER GOALS
            </span>
          </Grid.Column>
          <Grid.Column width={3}>
            <span style={styles['home-number']}>
              {props.interests}
            </span>
            <span style={styles['home-number-label']}>INTERESTS
            </span>
          </Grid.Column>
          <Grid.Column width={4}>
            <span style={styles['home-number']}>
              {props.opportunities}
            </span>
            <span style={styles['home-number-label']}>OPPORTUNITIES
            </span>
          </Grid.Column>
          <Grid.Column style={styles['float-left']} width={5}>
            <div style={styles['home-number']}>
              <span style={styles['float-left']}>{props.users}</span>
            </div>
            <div style={styles['home-number-label']}>
              STUDENTS, FACULTY,<br />
              MENTORS, ALUMNI</div>
          </Grid.Column>
        </Grid>
      </div>
    </Container>
  </div>
);

export default LandingSection2;
