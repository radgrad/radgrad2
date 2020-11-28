import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import HelpPanelWidget, { IHelpPanelWidgetProps } from '../../components/shared/HelpPanelWidget';
import ModerationWidgetContainer from '../../components/shared/moderation/ModerationWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

const AdvisorModerationPage: React.FC<IHelpPanelWidgetProps> = ({ helpMessages }) => (
  <div id="advisor-moderation-page">
    <AdvisorPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
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

export default withTracker(() => {
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    helpMessages,
  };
})(AdvisorModerationPage);
