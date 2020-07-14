import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourAdvisorOpportunities = () => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="six">
        <a href="/images/guidedtour/guidedtour-pendingverifications.png" target="_blank">
          <Image rounded src="/images/guidedtour/guidedtour-pendingverifications.png" />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="ten" textAlign="left">
        <div>
          <Header style={styles.h1}>Verifying participation</Header>

          <p style={styles.p}>
            RadGrad notifies students of opportunities, and when students participate, these experiences augment their
            ICE (Innovation, Competency, Experience) score. The student&apos;s ICE score provides a concrete metric of
            progress, and RadGrad incentivizes students to achieve 100 innovation, competency and experience points by
            the time they graduate.
          </p>

          <p style={styles.p}>
            But planning to experience a hackathon by adding it to your RadGrad degree plan does not mean that you will
            show up on the day and participate. RadGrad requires that opportunities be{' '}
            <strong
              style={styles['.guided-tour-description > p strong, .guided-tour-description ul > li strong']}
            >
              verified
            </strong> before the points associated with them are actually awarded to students.
          </p>

          <p style={styles.p}>
            The verification workflow is as follows: after a student experiences an opportunity, they can click on that
            opportunity in their degree plan and press the &quot;Request Verification&quot; button. That adds the
            student&apos;s opportunity verification request to a queue as illustrated in the attached screenshot. Both
            advisors and faculty have access to the queue and can accept or decline the verification request. (Note that
            a request can be initially declined but later accepted if the student provides new evidence that they
            participated.)
          </p>

          <p style={styles.p}>
            The goal of verification is not to make it difficult for students to achieve ICE points, but to simply
            ensure that ICE points have meaning. Without verification, anyone can get 100 innovation and experience
            points by simply loading up their plan with opportunities regardless of whether they actually take part in
            them or not.
          </p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourAdvisorOpportunities;
