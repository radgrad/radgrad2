import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import FacultyPageAboutMeWidget from '../../components/faculty/FacultyPageAboutMeWidget';

const FacultyHomePage = () => (
  <div>
    <FacultyPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}>
          <FacultyPageAboutMeWidget />
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>
  </div>
);

export default FacultyHomePage;
