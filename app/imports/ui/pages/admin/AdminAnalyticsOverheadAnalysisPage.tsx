import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminAnalyticsMenuWidget from '../../components/admin/AdminAnalyticsMenuWidget';
import AdminAnalyticsOverheadAnalysisWidget
  from '../../components/admin/AnalyticsOverheadAnalysisPage/AdminAnalyticsOverheadAnalysisWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

class AdminAnalyticsOverheadAnalysisPage extends React.Component {
  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div>
        <AdminPageMenuWidget />
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={3}>
              <AdminAnalyticsMenuWidget />
            </Grid.Column>

            <Grid.Column width={11}>
              <AdminAnalyticsOverheadAnalysisWidget />
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>
        </Grid>

        <BackToTopButton />
      </div>
    );
  }
}

export default AdminAnalyticsOverheadAnalysisPage;
