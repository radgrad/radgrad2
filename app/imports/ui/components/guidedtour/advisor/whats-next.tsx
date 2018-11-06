import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Grid, Header, Image, List, Segment } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const WhatsNext = () => (
  <div>
    <Grid container={true}>
      <Grid.Row centered={true}>
        <Grid.Column width={'eight'}>
          <Image rounded={true} size="large" src="/images/radgrad_logo.png"/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered={true}>
        <Grid.Column width={'twelve'}>
          <div style={styles.p}>
            <Header style={styles.h1}>What's next?</Header>
            <p>If you haven't been registered as an advisor for RadGrad, contact a RadGrad administrator to set up your account.</p>

            <p>If you just have questions about RadGrad, feel free to contact us at <a href="mailto:radgrad@hawaii.edu">radgrad@hawaii.edu</a>.</p>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default WhatsNext;
