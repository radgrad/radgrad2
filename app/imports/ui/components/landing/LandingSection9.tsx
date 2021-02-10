import React from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';
import RadGradLoginButtons from './RadGradLoginButtons';
import UserGuideButtons from './UserGuideButtons';
import styles from './utilities/landing-styles';

interface LandingSection9Props {
  instanceName: string;
  userGuideURL: string;
}
const LandingSection9: React.FC<LandingSection9Props> = ({ instanceName, userGuideURL }) => (
  <div id="landing-section-9" style={styles['section-9']}>
    <Grid stackable container columns={2}>
      <Grid.Column textAlign="center">
        <div style={styles['ready-to-get-started']}>
          <Header as="h1" style={styles['inverted-header2']}>
            <Icon size="large" name="sign-in" /> Ready to get started?
          </Header>
          <RadGradLoginButtons size="massive" instanceName={instanceName} />
        </div>
      </Grid.Column>
      <Grid.Column textAlign="center">
        <div style={styles['need-more-info']}>
          <Header as="h1" style={styles['inverted-header2']}>
            <Icon size="large" name="exclamation" /> Need more information?
          </Header>
          <UserGuideButtons />
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default LandingSection9;
