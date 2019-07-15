import * as React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import StudentMentorSpaceQuestionForm from '../../components/student/StudentMentorSpaceQuestionForm';
import StudentMentorSpaceQuestionsAccordion from '../../components/student/StudentMentorSpaceQuestionsAccordion';
import StudentMentorSpaceMentorDirectoryAccordion
  from '../../components/student/StudentMentorSpaceMentorDirectoryAccordion';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

/** A simple static component to render some text for the landing page. */
class StudentMentorSpacePage extends React.Component {
  public render() {
    return (
      <div>
        <StudentPageMenuWidget/>
        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={14}><HelpPanelWidget/></Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={10}>
              <Segment padded={true}>
                <Header dividing={true}>
                  <h4>QUESTIONS</h4>
                </Header>
                <StudentMentorSpaceQuestionsAccordion/>
              </Segment>
              <StudentMentorSpaceQuestionForm/>
            </Grid.Column>

            <Grid.Column width={4}>
              <Segment>
                <Header dividing={true}>
                  <h4>MENTOR DIRECTORY</h4>
                </Header>
                <StudentMentorSpaceMentorDirectoryAccordion/>
              </Segment>
            </Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

export default StudentMentorSpacePage;
