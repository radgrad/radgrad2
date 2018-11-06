import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Grid, Header, Image, List, Segment } from 'semantic-ui-react';
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
        <Grid.Column width={'twelve'}>
          <div style={styles.p}>
            <Header style={styles.h1}>Why Use RadGrad?</Header>
            <p>So, you're a computer science student. Why should you use RadGrad? In a nutshell:</p>
            <List as="ul">
              <List.Item style={styles.li}>You'll learn what this field has to offer.</List.Item>
              <List.Item style={styles.li}>You'll be better prepared for life after graduation.</List.Item>
              <List.Item style={styles.li}>You'll more easily find students with similar interests.</List.Item>
              <List.Item style={styles.li}>The laptop stickers are pretty cool.</List.Item>
            </List>
            <p>Continue with this guided tour for more details...</p>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default WhyRadGrad;
