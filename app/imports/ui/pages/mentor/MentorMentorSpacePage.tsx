import * as React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import StudentMentorSpaceMentorDirectoryAccordion
  from '../../components/student/StudentMentorSpaceMentorDirectoryAccordion';
import MentorMentorSpaceQuestionsAccordion from '../../components/mentor/MentorMentorSpaceQuestionsAccordion';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';

/** A simple static component to render some text for the landing page. */
class MentorMentorSpacePage extends React.Component {
  public render() {
    const moveDownStyle = {
      marginTop: 10,
    };
    return (
      <div>
        <MentorPageMenuWidget/>
        <Grid verticalAlign="middle" container={true} style={moveDownStyle}>
          <Grid.Row>
            <Grid.Column width={16}><HelpPanelWidgetContainer/></Grid.Column>
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
      </div>
    );
  }
}

const MentorMentorSpacePageCon = withGlobalSubscription(MentorMentorSpacePage);
const MentorMentorSpacePageContainer = withInstanceSubscriptions(MentorMentorSpacePageCon);

export default MentorMentorSpacePageContainer;
