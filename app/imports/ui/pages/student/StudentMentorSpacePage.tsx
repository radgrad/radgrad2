import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import StudentMentorSpaceQuestionForm from '../../components/student/StudentMentorSpaceQuestionForm';
import StudentMentorSpaceQuestionsAccordion from '../../components/student/StudentMentorSpaceQuestionsAccordion';
import StudentMentorSpaceMentorDirectoryAccordion
  from '../../components/student/StudentMentorSpaceMentorDirectoryAccordion';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import {
  studentMentorSpaceMentorDirectoryWidget,
  studentMentorSpaceQuestionsWidget,
} from '../../components/student/e2e-component-names';

const StudentMentorSpacePage = () => (
  <div>
    <StudentPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={10}>
          <Segment padded id={studentMentorSpaceQuestionsWidget}>
            <Header dividing>
              <h4>QUESTIONS</h4>
            </Header>
            <StudentMentorSpaceQuestionsAccordion />
          </Segment>
          <StudentMentorSpaceQuestionForm />
        </Grid.Column>

        <Grid.Column width={4}>
          <Segment id={studentMentorSpaceMentorDirectoryWidget}>
            <Header dividing>
              <h4>MENTOR DIRECTORY</h4>
            </Header>
            <StudentMentorSpaceMentorDirectoryAccordion />
          </Segment>
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>

    <BackToTopButton />
  </div>
);

export default StudentMentorSpacePage;
