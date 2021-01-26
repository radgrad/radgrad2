import React from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import { RadGradProperties } from '../../../../../api/radgrad/RadGradProperties';
import styles from '../../../../pages/landing/utilities/guidedtour-style';

const GuidedTourStudentWhatsNext: React.FC = () => {
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
              <p>If you haven&apos;t gotten your RadGrad account yet, please see your advisor to get set up, or attend one of the &quot;RadGrad Registration&quot; meetings.</p>
              <p>
                If you just have questions about RadGrad, feel free to contact us at&nbsp;
                <a href={mailto}>{adminEmail}</a>.
              </p>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default GuidedTourStudentWhatsNext;
