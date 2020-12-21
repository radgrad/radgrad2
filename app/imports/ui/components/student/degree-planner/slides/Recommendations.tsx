import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../../pages/landing/utilities/guidedtour-style';

const Recommendations: React.FC = () => (
  <div>
    <Grid container stackable>
      <Grid.Row centered>
        <Grid.Column width={5}>
          <Image rounded size="large" src="/images/help/degree-planner-recommendations-warnings2.png" />
        </Grid.Column>
        <Grid.Column width={11}>
          <Header style={styles.h1}>Recommendations & Warnings</Header>
          <p style={styles.p}>RadGrad can offer personalized recommendations for courses and opportunities based upon your interests, and your career goals.
            <br /><br />
            It will also flag problems with your degree plan, such as adding a course without the appropriate prerequisite.</p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default Recommendations;
