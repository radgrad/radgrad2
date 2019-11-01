import * as React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourMentorSetUp = () => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'nine'}>
        <a href="/images/guidedtour/guidedtour-mentor-profile.png" target="_blank"><Image rounded={true}
                                                                                          src="/images/guidedtour/guidedtour-mentor-profile.png"/>
          <p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'seven'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>Provide your profile</Header>
          <p style={styles.p}>To start using RadGrad, an advisor or RadGrad admin must create a mentor account for you,
            and provide you with login credentials.</p>
          <p style={styles.p}>Upon first login, it&apos;s important to update your profile. This lets students know
            about your areas of expertise and career goals. When students come across those interest areas and career
            goals elsewhere in the system, they will know that there is a mentor who can speak about them from
            professional experience.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourMentorSetUp;
