import * as React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourMentorExplorer = () => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'nine'}>
        <a href="/images/guidedtour/guidedtour-mentor-explorer.png" target="_blank"><Image rounded={true} src="/images/guidedtour/guidedtour-mentor-explorer.png"/><p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'seven'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>Review our courses, academic plans, opportunities, and career goals</Header>
          <p style={styles.p}>As a mentor, you are an invaluable source of insight into the relevance of our program in today&apos;s high tech job market.</p>
          <p style={styles.p}>The Explorer page allows you to review all of the defined Interests and Career Goals, as well as Opportunities, Academic Plans, Courses, and Users.</p>
          <p style={styles.p}>To request additions or modifications to any of these entities, you can contact a RadGrad Admin.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourMentorExplorer;
