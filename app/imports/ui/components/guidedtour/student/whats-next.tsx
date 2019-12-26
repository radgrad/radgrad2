import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourStudentWhatsNext = () => (
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
If you haven&apos;t gotten your RadGrad account yet, please see your advisor to get set up, or attend one
              of the &quot;RadGrad Registration&quot; meetings in ICSpace.
            </p>
            <p>
If you have a RadGrad account, then make sure you have joined the
              <a
                href="http://uhm-ics-community.slack.com"
                rel="noopener noreferrer"
                target="_blank"
              >
uhm-ics-community
              Slack team
              </a>
              {' '}
and check out the #radgrad channel for the latest news and updates!
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

export default GuidedTourStudentWhatsNext;
