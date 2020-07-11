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

          <Grid.Column width={4}>
            <span style={styles['home-number']}>
              {props.careerGoals}
            </span>
            <span style={styles['home-number-label']}><a style={{ fontWeight: 'normal' }} href="#/explorer/career-goals">CAREER GOALS</a>
            </span>
          </Grid.Column>
          <Grid.Column width={4}>
            <span style={styles['home-number']}>
              {props.interests}
            </span>
            <span style={styles['home-number-label']}><a style={{ fontWeight: 'normal' }} href="#/explorer/interests">INTERESTS</a>
            </span>
          </Grid.Column>
          <Grid.Column width={4}>
            <span style={styles['home-number']}>
              {props.opportunities}
            </span>
            <span style={styles['home-number-label']}><a style={{ fontWeight: 'normal' }} href="#/explorer/opportunities">OPPORTUNITIES</a>
            </span>
          </Grid.Column>
          <Grid.Column style={styles['float-left']} width={4}>
            <div style={styles['home-number']}>
              <span style={styles['float-left']}>{props.users}</span>
            </div>
            <div style={styles['home-number-label-last']}>
              STUDENTS, FACULTY,<br />
              MENTORS, ALUMNI</div>
          </Grid.Column>
        </Grid>
      </div>
    </Container>
  </div>
);

export default LandingSection2;
