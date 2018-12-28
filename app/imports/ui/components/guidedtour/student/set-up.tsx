import * as React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const SetUp = () => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'nine'}>
        <a href="/images/guidedtour/guidedtour-setup.png" target="_blank"><Image rounded={true} src="/images/guidedtour/guidedtour-setup.png"/><p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'seven'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>Set yourself up for awesomeness</Header>
          <p style={styles.p}>To start using RadGrad, an advisor or RadGrad admin must create an account for you. Then you can login using your regular UH credentials.</p>
          <p style={styles.p}>If you are a new student with minimal knowledge about computer science, your advisor will give you a basic overview, then create up your RadGrad account. You'll then work together to get a handle on your interests, career goals, and degree plan. If you have questions about any of those, RadGrad is designed to help you answer them.</p>
          <p style={styles.p}>Already well along in your degree program?  No problem! Just meet with your advisor to create your account. RadGrad can help you identify areas to strengthen before you graduate.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default SetUp;
