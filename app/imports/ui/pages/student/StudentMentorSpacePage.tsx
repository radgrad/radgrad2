import * as React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import StudentMentorSpaceQuestionForm from '../../components/student/StudentMentorSpaceQuestionForm';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

/** A simple static component to render some text for the landing page. */
class StudentMentorSpacePage extends React.Component {
  public render() {
    const marginStyle = {
      marginTop: 5,
    };
    return (
      <div>
        <StudentPageMenuWidget/>
        <Grid container={true} stackable={true} style={marginStyle}>
          <Grid.Row>
            <h3>Help Panel Widget goes here.</h3>
          </Grid.Row>

          <Grid.Column width={11}>
            <Segment padded={true}>
              <Header dividing={true}>
                <h4>QUESTIONS</h4>
              </Header>
              questionsList function goes here.
            </Segment>
              <StudentMentorSpaceQuestionForm/>
          </Grid.Column>

          <Grid.Column width={5}>
            <Segment>
              <Header dividing={true}>
                <h4>MENTOR DIRECTORY</h4>
              </Header>
              mentorFunction goes here.
            </Segment>
          </Grid.Column>

        </Grid>
      </div>
    );
  }
}

const StudentMentorSpacePageCon = withGlobalSubscription(StudentMentorSpacePage);
const StudentMentorSpacePageContainer = withInstanceSubscriptions(StudentMentorSpacePageCon);

export default StudentMentorSpacePageContainer;
