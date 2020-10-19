import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

interface ICareerPathProps {
  careerGoals: string;
}

const GuidedTourStudentCareerPath = (props: ICareerPathProps) => (
  <div>
    <Grid container>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Image rounded src="/images/guidedtour/path.png" />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={10} textAlign="left">
        <div>
          <Header style={styles.h1}>Define your career path</Header>
          <p style={styles.p}>
            Interests are important, but getting a job that&apos;s right for you is even more important. RadGrad
            provides a curated list of career goals that include many of the best careers in technology, including:
            {' '}<strong style={styles.strong}>{props.careerGoals}</strong>.
          </p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentCareerPath;
