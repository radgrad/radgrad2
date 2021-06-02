import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { useParams } from 'react-router';
import { PAGEIDS } from '../../../app/imports/ui/utilities/PageIDs';
import PageLayout from '../../../app/imports/ui/pages/PageLayout';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';
import Task2Segment from './Task2Segment';
import { Users } from '../../../app/imports/api/user/UserCollection';
import Task3Component from './Task3Component';
import { CareerGoals } from '../../../app/imports/api/career/CareerGoalCollection';
import Task4Component from './Task4Component';
import { CareerGoal } from '../../../app/imports/typings/radgrad';
import Task5Component from './Task5Component';
import Task6Component from './Task6Component';
import Task7Component from './Task7Component';


const headerPaneTitle = "Shinya's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';
const task1Header = <RadGradHeader title="TASK 1: HELLO WORLD" icon = "globe america"/>;

interface OnBoardTask {
  loggedInUser: string,
  urlUser: string,
  count: number,
  info: string,
  careerGoals: CareerGoal[],
}
const OnboardShinyaPage: React.FC<OnBoardTask> = ({ loggedInUser, urlUser, info, count }) => (
  <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <Task7Component/>
    <Task6Component/>
    <Task5Component/>
    <Task4Component/>
    <Task3Component/>
    <Grid columns={2}>
      <Grid.Column>
        <RadGradSegment header= {task1Header}>
                Hello World
        </RadGradSegment>;
      </Grid.Column>
      <Grid.Column>
        <Task2Segment loggedInUser={loggedInUser} urlUser={urlUser}/>
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
