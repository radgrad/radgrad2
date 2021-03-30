import React from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';
import UserGuideButtons from './UserGuideButtons';
import ExplorerButtons from './ExplorerButtons';
import styles from './utilities/landing-styles';
import RadGradLoginButtons from './RadGradLoginButtons';

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
            <Grid.Column width={4}><Icon name="sign in alternate" size='huge'/></Grid.Column>
            <Grid.Column width={12}>
              <Header style={styles['inverted-header2']}>
                Ready to get started?
              </Header>
              <RadGradLoginButtons inverted instanceName={instanceName}/>
            </Grid.Column>
          </Grid>
        </div>
      </Grid.Column>
      <Grid.Column>
        <div style={styles['need-more-info']}>
          <Grid>
            <Grid.Column width={4}><Icon name="info circle" size='huge'/></Grid.Column>
            <Grid.Column width={12}>
              <Header style={styles['inverted-header2']}>
                Need more information?
              </Header>
              <UserGuideButtons />
            </Grid.Column>
          </Grid>
        </div>
      </Grid.Column>
      <Grid.Column>
        <div style={styles['browse-explorers']}>
          <Grid>
            <Grid.Column width={4}><Icon name="search" size='huge'/></Grid.Column>
            <Grid.Column width={12}>
              <Header style={styles['inverted-header2']}>
                Browse our public explorers?
              </Header>
              <ExplorerButtons />
            </Grid.Column>
          </Grid>
        </div>
      </Grid.Column>
    </Grid>
  </div>
);

export default LandingSection9;
