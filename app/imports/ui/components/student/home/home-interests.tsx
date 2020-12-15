import React from 'react';
import { Grid, Header, Button } from 'semantic-ui-react';
import styles from '../../../pages/landing/utilities/guidedtour-style';

interface IInterestsProps {
  interests: number;
}

const GuidedTourStudentInterests: React.FC<IInterestsProps> = ({ interests }) => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width={1} />
      <Grid.Column width={5} textAlign="left">
        <p>
          <Button style={styles.btn} color="green">#Human-Computer Interaction</Button><br />
          <Button style={styles.btn} color="green">#Data Science</Button>
          <Button style={styles.btn} color="green">#Computer Architecture</Button><br />
          <Button style={styles.btn} color="green">#Bioinformatics</Button>
          <Button style={styles.btn} color="green">#IT Management</Button><br />
          <Button style={styles.btn} color="green">#Machine Learning</Button>
          <Button style={styles.btn} color="green">#Python</Button><br />
          <Button style={styles.btn} color="green">#Robotics</Button>
          <Button style={styles.btn} color="green">#Software Engineering</Button>
        </p>
      </Grid.Column>
      <Grid.Column width={9} textAlign="left">
        <div>
          <Header style={styles.h1}>Interests: the hashtags of <br />the RadGrad world</Header>
          <p style={styles.p}>
            Once you have specified one or more of RadGrad&apos;s
            <strong style={styles.strong}> {interests} </strong> interests, RadGrad can start to filter out
            opportunities that are unrelated to you. RadGrad can also make suggestions about courses and opportunities
            that you might not even know about.
          </p>
          <p style={styles.p}>It doesn&apos;t end there! RadGrad is designed to build community, so each interest within
            the Explorer page displays students, faculty members, and alumni that have chosen them. Make connections and
            learn faster.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentInterests;
