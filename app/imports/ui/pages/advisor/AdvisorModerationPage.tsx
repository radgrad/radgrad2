import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import ModerationWidgetContainer from '../../components/shared/ModerationWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

class AdvisorModerationPage extends React.Component {
  public render() {
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Grid container={true} stackable={true}>
          <Grid.Row>
            <HelpPanelWidget/>
          </Grid.Row>

          <Grid.Row>
            <ModerationWidgetContainer/>
          </Grid.Row>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

export default AdvisorModerationPage;
