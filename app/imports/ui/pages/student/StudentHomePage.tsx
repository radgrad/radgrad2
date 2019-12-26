import React from 'react';
import { Grid } from 'semantic-ui-react';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import StudentHomeWidget from '../../components/student/StudentHomeWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

const StudentHomePage = () => (
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
        <Grid.Column width={3}>
          <StudentHomeMenu />
        </Grid.Column>

        <Grid.Column width={11}>
          <StudentHomeWidget />
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

    </Grid>

    <BackToTopButton />
  </div>
);

export default StudentHomePage;
