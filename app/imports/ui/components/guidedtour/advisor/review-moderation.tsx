import * as React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const ReviewModeration = () => (
  <div>
    <Grid container={true} columns={2}>
      <Grid.Column width={'six'}>
        <a href="/images/guidedtour/guidedtour-reviewmoderation.png" target="_blank"><Image rounded={true} src="/images/guidedtour/guidedtour-reviewmoderation.png"/>
        <p style={styles.p}>Click for full-size image</p></a>
      </Grid.Column>
      <Grid.Column width={'ten'} textAlign={'left'}>
        <Header style={styles.h1}>Nurturing the social circle</Header>

        <p style={styles.p}>For RadGrad to truly create a "community", it must be possible for students to communicate back to the community both the strengths and the weaknesses of their degree experience.  Two way communication both empowers students and makes RadGrad more valuable to them.  To do this, RadGrad enables students to provide "reviews" of courses and opportunities.</p>

        <p style={styles.p}>RadGrad reviews are different from end-of-semester course assessments in several ways. First, they are not anonymous: the student providing the review is identified and is thus accountable to the community for their opinion. Second, they are not private to the instructor of the course; anyone in the community can see them. Third, students do not have just a single moment in time to provide a review; they can provide an initial review upon completing the course or opportunity, and then revise it later if they realize upon reflection that they can provide a more insightful reaction. Finally, reviews are not just limited to courses, but can provide feedback about extracurricular opportunities as well.</p>

        <p style={styles.p}>One of the activities for advisors in RadGrad is to provide "gentle" moderation of reviews. Indeed, RadGrad auto-publishes reviews as soon as a student writes them, in addition to placing them in a queue for moderation by an advisor.  If an advisor believes a student's review is not in their best interest, then the advisor has the ability to retract the review and ask the student to edit it prior to republication.  Our hope is that students will keep their reviews appropriate given that they are public and that their name is associated with them. Moderation will hopefully be needed only rarely if at all.</p>
      </Grid.Column>
    </Grid>
  </div>
);

export default ReviewModeration;
