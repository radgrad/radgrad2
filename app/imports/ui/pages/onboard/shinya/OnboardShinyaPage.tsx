import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { useParams } from 'react-router';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import Task1 from './Task1';
import Task2 from './Task2';
import { Users } from '../../../../api/user/UserCollection';
import Task3 from './Task3';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import Task4 from './Task4';
import { CareerGoal } from '../../../../typings/radgrad';
import Task5 from './Task5';
import Task6 from './Task6';
import Task7 from './Task7';

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
    <Task7 />
    <Task6 />
    <Task5 />
    <Task4 />
    <Task3 />
    <Grid columns={2}>
      <Grid.Column>
        <Task1 />
      </Grid.Column>
      <Grid.Column>
        <Task2 loggedInUser={loggedInUser} urlUser={urlUser} />
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
