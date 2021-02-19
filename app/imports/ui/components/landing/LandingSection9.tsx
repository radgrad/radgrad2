import React from 'react';
import { Grid, Header, Icon} from 'semantic-ui-react';
import RadGradLoginButtons from './RadGradLoginButtons';
import UserGuideButtons from './UserGuideButtons';
import styles from './utilities/landing-styles';

interface LandingSection9Props {
  instanceName: string;
  userGuideURL: string;
}
const LandingSection9: React.FC<LandingSection9Props> = ({ instanceName, userGuideURL }) => (
  <div id="landing-section-9" style={styles['section-9']}>
    <Grid doubling stackable container columns={3}>
      <Grid.Column>
        <div style={styles['ready-to-get-started']}>
          <Grid>
            <Grid.Column width={5}><Icon name="sign-in" size='massive'/></Grid.Column>
            <Grid.Column width={11}>
              <Header style={styles['inverted-header2']}>
                Ready to get started?
              </Header>
              <RadGradLoginButtons size="huge" instanceName={instanceName} />
            </Grid.Column>
          </Grid>
        </div>
      </Grid.Column>
      <Grid.Column>
        <div style={styles['ready-to-get-started']}>
          <Grid>
            <Grid.Column width={5}><Icon name="sign-in" size='massive'/></Grid.Column>
            <Grid.Column width={11}>
              <Header style={styles['inverted-header2']}>
                Ready to get started?
              </Header>
              <RadGradLoginButtons size="huge" instanceName={instanceName} />
            </Grid.Column>
          </Grid>
        </div>
      </Grid.Column>
      <Grid.Column>
        <div style={styles['need-more-info']}>
          <Grid>
            <Grid.Column width={5}><Icon name="exclamation" size='massive'/></Grid.Column>
            <Grid.Column width={11}>
              <Header style={styles['inverted-header2']}>
                Need more information?
              </Header>
              <UserGuideButtons />
            </Grid.Column>
          </Grid>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default LandingSection9;
