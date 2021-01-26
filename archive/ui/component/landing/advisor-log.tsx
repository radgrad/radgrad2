import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../../app/imports/ui/pages/landing/utilities/guidedtour-style';

const GuidedTourStudentAdvisorLog: React.FC = () => (
  <div>
    <Grid container columns={2}>
      <Grid.Column width="ten">
        <a href="/images/guidedtour/guidedtour-advisor-log.png" target="_blank">
          <Image
            rounded
            src="/images/guidedtour/guidedtour-advisor-log.png"
          />
          <p style={styles.p}>Click for full-size image</p>
        </a>
      </Grid.Column>
      <Grid.Column width="six" textAlign="left">
        <div>
          <Header style={styles.h1}>Now, what did my advisor tell me?</Header>
          <p style={styles.p}>RadGrad enhances but does not replace the need for regular meetings with your advisor.</p>
          <p style={styles.p}>
            To help you recall the decisions made and actions taken during your meetings, RadGrad provides the Advisor
            Meeting Log.
          </p>
          <p style={styles.p}>
            Only Advisors can make entries in this log, but both you and your Advisor can see the entries after they
            have been created.
          </p>
          <p style={styles.p}>
            To get the most out of RadGrad, be sure to meet with your advisor once a semester. That also provides a
            convenient time to pick up your RadGrad laptop sticker if you&apos;ve achieved a new level.
          </p>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default GuidedTourStudentAdvisorLog;
