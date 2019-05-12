import * as React from 'react';
import { Grid, Header, Image, List } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const Opportunities = () => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'nine'}>
        <a href="/images/guidedtour/guidedtour-faculty-opportunities.png" target="_blank"><Image rounded={true} src="/images/guidedtour/guidedtour-faculty-opportunities.png"/><p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'seven'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>Promote your research</Header>
          <p style={styles.p}>In RadGrad, opportunities are activities outside of regular coursework that enable students to earn &quot;Innovation&quot; and &quot;Experience&quot; points.</p>
          <p style={styles.p}>For faculty, opportunities provide a mechanism for you to advertise your research projects to students. Using RadGrad has several benefits:</p>
          <List>
            <List.Item style={styles.li}>By associating one or more &quot;interests&quot; (i.e. disciplinary areas) with your research project, RadGrad can recommend your project to students who have also specified those interest areas.</List.Item>
            <List.Item style={styles.li}>Students gain ICE points for completing opportunities, and students who wish to achieve the higher levels in RadGrad will almost certainly need to participate in a faculty research project.</List.Item>
            <List.Item style={styles.li}>Students can pick your research project for multiple semesters and earn Innovation points for each semester.</List.Item>
          </List>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default Opportunities;
