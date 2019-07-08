import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import CourseScoreboardWidget from '../../components/shared/CourseScoreboardWidget';

class AdvisorCourseScoreboardPage extends React.Component {
  public render() {
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Grid container={true} stackable={true}>
          <Grid.Row>
            <HelpPanelWidget/>
          </Grid.Row>

          <Grid.Column width={16}>
            <CourseScoreboardWidget/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdvisorCourseScoreboardPageCon = withGlobalSubscription(AdvisorCourseScoreboardPage);
const AdvisorCourseScoreboardPageContainer = withInstanceSubscriptions(AdvisorCourseScoreboardPageCon);

export default AdvisorCourseScoreboardPageContainer;
