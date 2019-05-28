import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import CourseScoreboardWidget from '../../components/shared/CourseScoreboardWidget';

/** A simple static component to render some text for the landing page. */
class FacultyCourseScoreboardPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (
      <div>
        <FacultyPageMenuWidget/>
        <Grid verticalAlign="middle" textAlign="center" container={true}>
          <Grid.Column width={16}>
            <CourseScoreboardWidget/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const FacultyCourseScoreboardPageCon = withGlobalSubscription(FacultyCourseScoreboardPage);
const FacultyCourseScoreboardPageContainer = withInstanceSubscriptions(FacultyCourseScoreboardPageCon);

export default FacultyCourseScoreboardPageContainer;
