import * as React from 'react';
import { Grid, Header, Image, List } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const WhyRadGrad = () => (
  <div>
    <Grid container={true}>
      <Grid.Row centered={true}>
        <Grid.Column width={'eight'}>
          <Image rounded={true} size="large" src="/images/guidedtour/guidedtour-why-radgrad.png"/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered={true}>
        <Grid.Column width={'twelve'} textAlign={'center'}>
          <div style={styles.p}>
            <Header style={styles.h1}>Why Use RadGrad?</Header>
            <p>So, you&apos;re a faculty member in computer science, and already overbooked and overwhelmed. Why should you spend the time to learn yet another online tool? In a nutshell, we believe RadGrad offers the following benefits to you:</p>
            <List as="ul">
              <List.Item style={styles.li}>RadGrad helps you promote your research projects to motivated computer science students with compatible interests.</List.Item>
              <List.Item style={styles.li}>RadGrad incentivizes students to participate effectively in your research.</List.Item>
              <List.Item style={styles.li}>RadGrad allows you, along with other faculty, to collaboratively define and update disciplinary areas, career goals, and extra-curricular opportunities. This helps students stay abreast of the latest developments with only nominal effort on your part.</List.Item>
            </List>
            <p>Before continuing with this Guided Tour, please check out the Student Guided Tour first. This Faculty Guided Tour builds off the one for students.</p>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default WhyRadGrad;
