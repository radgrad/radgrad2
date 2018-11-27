import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

/** A simple static component to render some text for the landing page. */
class StudentMentorSpacePage extends React.Component {
  public render() {
    return (
      <div>
        <StudentPageMenuWidget/>
        <Grid verticalAlign="middle" textAlign="center" container={true}>

          <Grid.Column width={4}>
            <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Student Mentor Space</h1>
          </Grid.Column>

        </Grid>
      </div>
    );
  }
}

const StudentMentorSpacePageCon = withGlobalSubscription(StudentMentorSpacePage);
const StudentMentorSpacePageContainer = withInstanceSubscriptions(StudentMentorSpacePageCon);

export default StudentMentorSpacePageContainer;
