import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import MentorAboutMeWidget from '../../components/mentor/MentorAboutMeWidget';

/** A simple static component to render some text for the landing page. */
const MentorHomePage = () => (
  <div>
    <MentorPageMenuWidget/>
    <Grid container={true} stackable={true}>
      <Grid.Row>
        <HelpPanelWidget/>
      </Grid.Row>

      <Grid.Column width={16}>
        <MentorAboutMeWidget/>
      </Grid.Column>
    </Grid>
  </div>
);

export default MentorHomePage;
