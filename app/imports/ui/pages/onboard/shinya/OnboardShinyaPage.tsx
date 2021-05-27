import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { useParams } from 'react-router';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import Task1Segment from './Task1Segment';
import Task2Segment from './Task2Segment';
import { Users } from '../../../../api/user/UserCollection';
import Task3Component from './Task3Component';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import Task4Component from './Task4Component';
import { CareerGoal } from '../../../../typings/radgrad';
import Task5Component from './Task5Component';
import Task6Component from './Task6Component';
import Task7Component from './Task7Component';

const headerPaneTitle = "Shinya's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

interface OnBoardTask {
  loggedInUser: string,
  urlUser: string,
  count: number,
  info: string,
  careerGoals: CareerGoal[],
}

const OnboardShinyaPage: React.FC<OnBoardTask> = ({ loggedInUser, urlUser, info, count }) => (
  <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <Task7Component />
    <Task6Component />
    <Task5Component />
    <Task4Component />
    <Task3Component />
    <Grid columns={2}>
      <Grid.Column>
        <Task1Segment />
      </Grid.Column>
      <Grid.Column>
        <Task2Segment loggedInUser={loggedInUser} urlUser={urlUser} />
      </Grid.Column>
    </Grid>
  </PageLayout>
);

export default withTracker(() => {
  const loggedInUser = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();
  const urlUser = Users.getProfile(username).username;
  const count = CareerGoals.countNonRetired();
  return {
    loggedInUser,
    urlUser,
    count,
  };
})(OnboardShinyaPage);
// export default OnboardShinyaPage;
