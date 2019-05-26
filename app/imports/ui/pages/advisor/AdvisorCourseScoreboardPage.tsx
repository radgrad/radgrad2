import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import CourseScoreboardWidget from '../../components/shared/CourseScoreboardWidget';

/** A simple static component to render some text for the landing page. */
class AdvisorCourseScoreboardPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Grid verticalAlign="middle" textAlign="center" container={true}>
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
