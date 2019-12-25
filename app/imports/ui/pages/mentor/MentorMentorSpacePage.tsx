import React from 'react';
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
    <Grid stackable={true}>
      <Grid.Row>
        <Grid.Column width={1}/>
        <Grid.Column width={14}><HelpPanelWidget/></Grid.Column>
        <Grid.Column width={1}/>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1}/>
        <Grid.Column width={10}>
          <MentorMentorSpaceQuestionsAccordion/>
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

export default MentorMentorSpacePage;
