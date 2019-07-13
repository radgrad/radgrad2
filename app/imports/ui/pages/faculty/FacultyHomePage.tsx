import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import FacultyPageAboutMeWidget from '../../components/faculty/FacultyPageAboutMeWidget';

const FacultyHomePage = () => (
  <div>
    <FacultyPageMenuWidget/>
    <Grid container={true} stackable={true}>
      <Grid.Row>
        <HelpPanelWidget/>
      </Grid.Row>

      <Grid.Column width={16}>
        <FacultyPageAboutMeWidget/>
      </Grid.Column>
    </Grid>
  </div>
);

export default FacultyHomePage;
