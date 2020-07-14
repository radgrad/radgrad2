import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import styles from '../../../pages/landing/guidedtour-style';

const GuidedTourFacultyWhatsNext = () => {
  const adminEmail = RadGradProperties.getAdminEmail();
  const mailto = `mailto:${adminEmail}`;
  return (
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
                <a href={mailto}> {adminEmail}</a> to request one.
              </p>
              <p>
                If you have a RadGrad account, then please login, update your profile if necessary, and create one or
                more opportunities for your research projects and/or other activities of interest.
              </p>
              <p>
                If you just have questions about RadGrad, feel free to contact us at&nbsp;
                <a
                  href={mailto}
                >
                  {adminEmail}
                </a>
                .
              </p>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default GuidedTourFacultyWhatsNext;
