import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../../pages/landing/utilities/guidedtour-style';

interface ICoursesProps {
  courses: number;
  courseReviews: number;
}

const GuidedTourStudentCourses: React.FC<ICoursesProps> = ({ courses, courseReviews }) => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="ten">
        <a href="/images/guidedtour/guidedtour-courses.png" target="_blank">
          <Image
            rounded
            src="/images/guidedtour/guidedtour-courses.png"
          />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="six" textAlign="left">
        <div>
          <Header style={styles.h1}>Coursing through your degree program</Header>
          <p style={styles.p}>
            RadGrad provides information about <strong style={styles.strong}>{courses}</strong> courses.
            That&apos;s a lot! You might be wondering, &quot;Which ones should I take? Will this course benefit me? Do I
            need to take it?&quot; RadGrad can help answer all these questions.
          </p>
          <p style={styles.p}>
            Once RadGrad knows about your interests and career goals, it will recommend courses that are directly
            related to them. It can also tell you which ones are required for your chosen degree program.
          </p>
          <p style={styles.p}>
            Want to get a fellow student&apos;s perspective on a course? RadGrad allows you to create a review for any
            course you have completed, and currently provides
            <strong style={styles.strong}> {courseReviews}</strong> reviews. Note that these reviews are public,
            and your name appears with your review. We think RadGrad course reviews are one of the best features of the
            system.
          </p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentCourses;
