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
            <p>If you haven't gotten your RadGrad account yet, please see your advisor to get set up, or attend one of the "RadGrad Registration" meetings in ICSpace.</p>
            <p>If you have a RadGrad account, then make sure you have joined the <a href="http://uhm-ics-community.slack.com" target="_blank">uhm-ics-community Slack team</a> and check out the #radgrad channel for the latest news and updates!</p>
            <p>If you just have questions about RadGrad, feel free to contact us at <a href="mailto:radgrad@hawaii.edu">radgrad@hawaii.edu</a>.</p>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default WhatsNext;
