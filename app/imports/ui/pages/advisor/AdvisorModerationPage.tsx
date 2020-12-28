import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import HelpPanelWidget, { HelpPanelWidgetProps } from '../../components/shared/HelpPanelWidget';
import ModerationWidget, { ModerationWidgetProps } from '../../components/shared/moderation/ModerationWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { Reviews } from '../../../api/review/ReviewCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';

interface AdvisorModerationPageProps extends HelpPanelWidgetProps, ModerationWidgetProps {
}

const AdvisorModerationPage: React.FC<AdvisorModerationPageProps> = ({ courseReviews, helpMessages, opportunityReviews }) => (
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
        <Grid.Column width={14}>
          <ModerationWidget
            courseReviews={courseReviews}
            opportunityReviews={opportunityReviews}
          />
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>

    <BackToTopButton />
  </div>
);

const AdvisorModerationPageContainer = withTracker(() => {
  const helpMessages = HelpMessages.findNonRetired({});
  const opportunityReviews = Reviews.findNonRetired({ moderated: false, reviewType: 'opportunity' });
  const courseReviews = Reviews.findNonRetired({ moderated: false, reviewType: 'course' });
  return {
    courseReviews,
    helpMessages,
    opportunityReviews,
  };
})(AdvisorModerationPage);

export default withListSubscriptions(AdvisorModerationPageContainer, [
  HelpMessages.getPublicationName(),
  Reviews.getPublicationName(),
]);
