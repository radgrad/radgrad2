import React from 'react';
import { Grid, Header, Image, List } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourStudentWhyRadGrad = () => (
  <div>
    <Grid container>
      <Grid.Row centered>
        <Grid.Column width="twelve">
          <div style={styles.p}>
            <Header style={styles.h1}>Why Use RadGrad?</Header>
            <p>So, you&apos;re a computer science student. Why should you use RadGrad? In a nutshell:</p>
            <List as="ul">
              <List.Item style={styles.li}>You&apos;ll learn what this field has to offer.</List.Item>
              <List.Item style={styles.li}>You&apos;ll be better prepared for life after graduation.</List.Item>
              <List.Item style={styles.li}>You&apos;ll more easily find students with similar interests.</List.Item>
              <List.Item style={styles.li}>The laptop stickers are pretty cool.</List.Item>
            </List>
            <p>Continue with this guided tour for more details...</p>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default GuidedTourStudentWhyRadGrad;
