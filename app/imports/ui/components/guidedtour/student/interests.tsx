import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

interface IInterestsProps {
  interests: number;
}
const GuidedTourStudentInterests = (props: IInterestsProps) => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'nine'}>
        <a href="/images/guidedtour/guidedtour-interests.png" target="_blank"><Image rounded={true} src="/images/guidedtour/guidedtour-interests.png"/><p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'seven'} textAlign={'left'}>
        <div>
          <Header style={styles.h1}>Interests: the hashtags of the RadGrad world</Header>
          <p style={styles.p}>One useful resource in RadGrad is the Explorer page, which enables you to learn about the latest computer science interest areas, courses, opportunities, academic plans, and even the other members of RadGrad.</p>
          <p style={styles.p}>Once you have specified one or more of RadGrad&apos;s <strong style={styles.strong}>{props.interests}</strong> interests, RadGrad can start to filter out opportunities that are unrelated to you. RadGrad can also make suggestions about courses and opportunities that you might not even know about.</p>
          <p style={styles.p}>It doesn&apos;t end there!  RadGrad is designed to build community, so each interest within the Explorer page displays students, faculty members, and alumni that have chosen them.  Make connections and learn faster.</p>
          <p style={styles.p}>Of course, many students might only have a vague idea of the range of interests and career goals in computer science, and RadGrad provides an opportunity for the advisor to start this discussion and show them how RadGrad enables them to learn more about the field at their own pace.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentInterests;
