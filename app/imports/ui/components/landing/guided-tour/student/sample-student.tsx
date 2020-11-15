import React from 'react';
import { Grid, Header, Image, List } from 'semantic-ui-react';
import styles from '../../../../pages/landing/utilities/guidedtour-style';

const GuidedTourStudentSampleStudent = () => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="ten">
        <a href="/images/guidedtour/guidedtour-sample-student.png" target="_blank">
          <Image
            rounded
            src="/images/guidedtour/guidedtour-sample-student.png"
          />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="six" textAlign="left">
        <div>
          <Header style={styles.h1}>Putting it all together</Header>
          <p style={styles.p}>
            So, what does a successful degree plan look like in RadGrad? Here&apos;s a hypothetical student who has
            completed all of the requirements for a B.S. in Computer Science, plus a set of opportunities that earned
            her at least 100 points in all three ICE categories. Some things to notice about her degree experience:
          </p>
          <List>
            <List.Item style={styles.li}>
              She achieved a 3.5 GPA in her computer science courses. That earned her well over 100 Competency points.
            </List.Item>
            <List.Item style={styles.li}>
              She worked with a faculty member on a research project for both semesters of her senior year. That alone
              earned her 50 of her 100 Innovation points.
            </List.Item>
            <List.Item style={styles.li}>
              She did a summer internship with a high tech company between her junior and senior years, in addition to a
              computer science-related part-time job for two semesters. Those three Opportunities earned her 50 of her
              105 Experience points.
            </List.Item>
            <List.Item style={styles.li}>
              She filled out her degree experience by participating in a variety of university and community clubs: ACM
              Manoa, Code for Hawaii, and so forth.
            </List.Item>
            <List.Item style={styles.li}>
              Because the Department does not currently offer a course in the Unity 3D programming environment, she took
              an online course through Coursera during the Summer and received Competency points for successfully
              completing it.
            </List.Item>
          </List>
          <p style={styles.p}>
            This ICE score, along with some other activities in RadGrad, enabled this student to achieve the highest
            Level in RadGrad (Black, Level 6).
          </p>
          <p style={styles.p}>
            As this degree experience illustrates, becoming a well-rounded graduate doesn&apos;t require a ridiculous
            amount of time investment, but it does require you to be <em>strategic</em> about what you participate in.
            And that&apos;s a good thing!
          </p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentSampleStudent;
