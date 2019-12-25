import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourFacultyExplorer = () => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'nine'}>
        <a href="/images/guidedtour/guidedtour-faculty-explorer.png" target="_blank"><Image rounded={true} src="/images/guidedtour/guidedtour-faculty-explorer.png"/><p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'seven'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>Curate the opportunities and career goals</Header>
          <p style={styles.p}>As a faculty member, you are an invaluable source of insight into computer science disciplinary areas (&quot;interests&quot;) as well as rewarding and/or emerging career goals.</p>
          <p style={styles.p}>The Explorer page allows you to review all of the defined Interests and Career Goals, as well as Opportunities, Academic Plans, Courses, and Users.</p>
          <p style={styles.p}>To request additions or modifications to any of these entities, you can contact a RadGrad Admin.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourFacultyExplorer;
