import * as React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const Verification = () => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'nine'}>
        <a href="/images/guidedtour/guidedtour-faculty-verification.png" target="_blank"><Image rounded={true} src="/images/guidedtour/guidedtour-faculty-verification.png"/><p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'seven'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>Verify student participation</Header>
          <p style={styles.p}>When students choose an opportunity that you sponsor, such as one of your research projects, they must request &quot;verification&quot; in order to actually earn the points associated with that opportunity.</p>
          <p style={styles.p}>For you, this means that you can establish criteria for acceptable performance by the student, and only award them their ICE points when you are satisfied with their work.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default Verification;
