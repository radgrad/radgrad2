import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourMentorWhatsNext = () => (
  <div>
    <Grid container>
      <Grid.Row centered>
        <Grid.Column width="eight">
          <Image rounded size="large" src="/images/radgrad_logo.png" />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered>
        <Grid.Column width="twelve">
          <div style={styles.p}>
            <Header style={styles.h1}>What&apos;s next?</Header>
            <p>
If you do not have a RadGrad account yet, please contact a RadGrad administrator at
              <a
                href="mailto:radgrad@hawaii.edu"
              >
radgrad@hawaii.edu
              </a>
              {' '}
to request one.
            </p>
            <p>
If you have a RadGrad account, then please login, update your profile if necessary, and see if there are
              any questions you&apos;d like to answer.
            </p>
            <p>
You might also want to join the
              <a
                href="http://uhm-ics-community.slack.com"
                rel="noopener noreferrer"
                target="_blank"
              >
uhm-ics-community Slack team
              </a>
              {' '}
and check out the
              #radgrad channel for the latest news and updates.
            </p>
            <p>
If you just have questions about RadGrad, feel free to contact us at
              <a
                href="mailto:radgrad@hawaii.edu"
              >
radgrad@hawaii.edu
              </a>
.
            </p>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default GuidedTourMentorWhatsNext;
