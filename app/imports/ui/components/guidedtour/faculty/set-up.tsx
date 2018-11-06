import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Grid, Header, Image, List, Segment } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const SetUp = () => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'nine'}>
        <a href="/images/guidedtour/guidedtour-faculty-profile.png" target="_blank"><Image rounded={true} src="/images/guidedtour/guidedtour-faculty-profile.png"/><p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'seven'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>Provide your profile</Header>
          <p style={styles.p}>To start using RadGrad, an advisor or RadGrad admin must create a faculty account for you. Then you can login using your regular UH credentials.</p>
          <p style={styles.p}>It's useful to specify your disciplinary areas ("interests") as well as career goals for which you have some expertise. Your profile picture will then be associated with these interests and career goals, and students will know to come to you for advising.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default SetUp;
