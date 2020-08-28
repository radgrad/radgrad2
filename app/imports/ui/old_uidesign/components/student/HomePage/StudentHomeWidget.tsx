import React from 'react';
import { Grid } from 'semantic-ui-react';
import StudentFeedWidget from '../../../../components/shared/CommunityUsersPage/CommunityFeedWidget';
import StudentTeaserWidget from './StudentTeaserWidget';
import StudentOfInterestWidget from './StudentOfInterestWidget';

const StudentHomeWidget = () => (
  <Grid centered stackable>
    <Grid.Column width={10}>
      <StudentOfInterestWidget type="opportunities" />
      <StudentOfInterestWidget type="courses" />
    </Grid.Column>

    <Grid.Column width={6}>
      <StudentFeedWidget />
      <br />
      <StudentTeaserWidget />
    </Grid.Column>
  </Grid>
);

export default StudentHomeWidget;
