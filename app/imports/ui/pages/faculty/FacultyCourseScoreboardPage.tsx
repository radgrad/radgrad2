import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import CourseScoreboardWidget from '../../components/shared/CourseScoreboardWidget';

/** A simple static component to render some text for the landing page. */
class FacultyCourseScoreboardPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    const moveDownStyle = {
      marginTop: 10,
    };
    return (
      <div>
        <FacultyPageMenuWidget/>
        <Grid verticalAlign="middle" container={true} style={moveDownStyle}>
          <Grid.Row>
            <Grid.Column width={16}><HelpPanelWidgetContainer/></Grid.Column>
          </Grid.Row>
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
