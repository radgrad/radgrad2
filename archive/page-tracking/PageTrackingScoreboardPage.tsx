import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { PageInterestsDailySnapshots } from '../../../api/page-tracking/PageInterestsDailySnapshotCollection';
import { HelpMessage, PageInterestsDailySnapshot } from '../../../typings/radgrad';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import PageTrackingMenu from '../../components/shared/page-tracking/PageTrackingMenu';
import PageTrackingScoreboardWidget from '../../components/shared/page-tracking/PageTrackingScoreboardWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { getMenuWidget } from './utilities/getMenuWidget';

interface PageTrackingAnalysisPageProps {
  helpMessages: HelpMessage[];
  pageInterestsDailySnapshots: PageInterestsDailySnapshot[];
}

const PageTrackingScoreboardPage: React.FC<PageTrackingAnalysisPageProps> = ({ helpMessages, pageInterestsDailySnapshots }) => {
  const match = useRouteMatch();
  return (
    <React.Fragment>
      {getMenuWidget(match)}

      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}>
            <HelpPanelWidget helpMessages={helpMessages} />
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
            <PageTrackingMenu type="scoreboard" />
          </Grid.Column>

          <Grid.Column width={11} stretched>
            <PageTrackingScoreboardWidget pageInterestsDailySnapshots={pageInterestsDailySnapshots} />
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </React.Fragment>
  );
};

const PageTrackingScoreboardPageContainer = withTracker(() => {
  const helpMessages = HelpMessages.findNonRetired({});
  const pageInterestsDailySnapshots: PageInterestsDailySnapshot[] = PageInterestsDailySnapshots.find({}).fetch();
  return {
    helpMessages,
    pageInterestsDailySnapshots,
  };
})(PageTrackingScoreboardPage);

export default PageTrackingScoreboardPageContainer;
