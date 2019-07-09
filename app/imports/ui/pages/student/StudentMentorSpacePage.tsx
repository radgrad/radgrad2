import * as React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import StudentMentorSpaceQuestionForm from '../../components/student/StudentMentorSpaceQuestionForm';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentMentorSpaceQuestionsAccordion from '../../components/student/StudentMentorSpaceQuestionsAccordion';
import StudentMentorSpaceMentorDirectoryAccordion
  from '../../components/student/StudentMentorSpaceMentorDirectoryAccordion';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

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
            <Grid.Column width={16}><HelpPanelWidgetContainer/></Grid.Column>
          </Grid.Row>

          <Grid.Column width={11}>
            <Segment padded={true}>
              <Header dividing={true}>
                <h4>QUESTIONS</h4>
              </Header>
              <StudentMentorSpaceQuestionsAccordion/>
            </Segment>
            <StudentMentorSpaceQuestionForm/>
          </Grid.Column>

          <Grid.Column width={5}>
            <Segment>
              <Header dividing={true}>
                <h4>MENTOR DIRECTORY</h4>
              </Header>
              <StudentMentorSpaceMentorDirectoryAccordion/>
            </Segment>
          </Grid.Column>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const StudentMentorSpacePageCon = withGlobalSubscription(StudentMentorSpacePage);
const StudentMentorSpacePageContainer = withInstanceSubscriptions(StudentMentorSpacePageCon);

export default StudentMentorSpacePageContainer;
