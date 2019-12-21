import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import MentorAboutMeWidget from '../../components/mentor/MentorAboutMeWidget';

/** A simple static component to render some text for the landing page. */
const MentorHomePage = () => (
  <div>
    <MentorPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}>
          <MentorAboutMeWidget />
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>
  </div>
);

export default MentorHomePage;
