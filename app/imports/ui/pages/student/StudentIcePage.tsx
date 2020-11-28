import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import HelpPanelWidget, { IHelpPanelWidgetProps } from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentIceWidget from '../../components/student/ice/StudentIceWidget';

const StudentIcePage: React.FC<IHelpPanelWidgetProps> = ({ helpMessages }) => (
  <div id="student-ice-points-page">
    <StudentPageMenuWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} stretched>
            <StudentIceWidget />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <BackToTopButton />
    </Container>
  </div>
);

const StudentHomeIcePageContainer = withTracker(() => {
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    helpMessages,
  };
})(StudentIcePage);

export default StudentHomeIcePageContainer;
