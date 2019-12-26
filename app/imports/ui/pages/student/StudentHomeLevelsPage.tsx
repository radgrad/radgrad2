import React from 'react';
import { Grid } from 'semantic-ui-react';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentHomeMenu from '../../components/student/StudentHomeMenu';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentLevelsWidget from '../../components/student/StudentLevelsWidget';
import StudentLevelsOthersWidget from '../../components/student/StudentLevelsOthersWidget';

const StudentHomeLevelsPage = () => (
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
          <Grid container stackable columns="equal">
            <Grid.Column stretched>
              <StudentLevelsWidget />
            </Grid.Column>

            <Grid.Column stretched>
              <StudentLevelsOthersWidget />
            </Grid.Column>
          </Grid>
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>

    <BackToTopButton />
  </div>
);

export default StudentHomeLevelsPage;
