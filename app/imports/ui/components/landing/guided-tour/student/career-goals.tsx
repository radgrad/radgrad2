import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../../pages/landing/utilities/guidedtour-style';

interface ICareerPathProps {
  careerGoals: string;
}

const GuidedTourStudentCareerPath = (props: ICareerPathProps) => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="ten">
        <a href="/images/guidedtour/guidedtour-career.png" target="_blank">
          <Image rounded src="/images/guidedtour/guidedtour-career.png" />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="six" textAlign="left">
        <div>
          <Header style={styles.h1}>Define your career path</Header>
          <p style={styles.p}>
            Interests are important, but getting a job that&apos;s right for you is even more important. RadGrad
            provides a curated list of career goals that include many of the best careers in technology, including:
            {' '}{props.careerGoals}.
          </p>
          <p style={styles.p}>RadGrad&apos;s Career Goal page describes each career along with recommended courses and
            opportunities. You can pick more than one career goal and RadGrad can help you prepare for all of them.</p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentCareerPath;
