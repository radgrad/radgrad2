import * as React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import StudentMentorSpaceMentorDirectoryAccordion
  from '../../components/student/StudentMentorSpaceMentorDirectoryAccordion';
import MentorMentorSpaceQuestionsAccordion from '../../components/mentor/MentorMentorSpaceQuestionsAccordion';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

/** A simple static component to render some text for the landing page. */
const MentorMentorSpacePage = () => (
  <div>
    <MentorPageMenuWidget/>
    <Grid container={true} stackable={true}>
      <Grid.Row>
        <HelpPanelWidget/>
      </Grid.Row>

      <Grid.Column width={11}>
        <MentorMentorSpaceQuestionsAccordion/>
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

export default MentorMentorSpacePage;
