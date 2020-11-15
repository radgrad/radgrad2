import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import ModerationWidgetContainer from '../../components/shared/moderation-page/ModerationWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

const AdvisorModerationPage = () => (
  <div id="advisor-moderation-page">
    <AdvisorPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><ModerationWidgetContainer /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>

    <BackToTopButton />
  </div>
);

export default AdvisorModerationPage;
