import React from 'react';
import { Grid, Header, Image, List } from 'semantic-ui-react';
import styles from '../../../../pages/landing/guidedtour-style';

const GuidedTourStudentICE = () => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="nine">
        <a href="/images/guidedtour/guidedtour-ice.png" target="_blank">
          <Image rounded src="/images/guidedtour/guidedtour-ice.png" />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="seven" textAlign="left">
        <div>
          <Header style={styles.h1}>ICE, ICE, baby</Header>
          <p style={styles.p}>
            You may have been noticing three colored circles with numbers in your menu bar. These circles and numbers
            represent your <strong style={styles.strong}>ICE</strong> score. ICE stands for: Innovation, Competency, and
            Experience, which we view as the three pillars of a well-rounded computer science major.
          </p>
          <p style={styles.p}>
            ICE recognizes that developing your chops in <em>innovation</em> and acquiring
            real-world <em>experience</em> are just as important as <em>competency</em> through coursework. ICE
            provides you with a new means to assess gaps in your preparation, and helps you figure out how to fill those
            gaps.
          </p>
          <List as="ul">
            <List.Item style={styles.li}>
              <strong className="ice-innovation-proj-color">Innovation</strong>
              : You gain innovation points by completing opportunities that have a research (or some other innovative)
              component. The number of points depends upon the nature of the opportunity.
            </List.Item>
            <List.Item style={styles.li}>
              <strong className="ice-competency-proj-color">Competency</strong>
              : You gain 10 competency points when you get an A in a degree-related course, and 6 points when you get a
              B. No points are awarded for grades below B-.
            </List.Item>
            <List.Item style={styles.li}>
              <strong className="ice-experience-proj-color">Experience</strong>
              : You gain experience points by completing opportunities that expose you to real-world organizations and
              work processes. The number of points depends upon the nature of the opportunity.
            </List.Item>
          </List>
          <p style={styles.p}>By the end of your degree program, your mission (should you decide to accept it) is to
            obtain 100 points in each of the three ICE categories.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentICE;
