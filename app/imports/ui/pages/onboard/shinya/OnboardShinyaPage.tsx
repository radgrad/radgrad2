import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { useParams } from 'react-router';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import Task2Segment from './Task2Segment';
import { Users } from '../../../../api/user/UserCollection';
import Task3Component from './Task3Component';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';

const headerPaneTitle = "Shinya's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';
const task1Header = <RadGradHeader title="TASK 1: HELLO WORLD" icon = "globe america"/>;

interface OnBoardTask {
  loggedInUser: string,
  urlUser: string,
  goal: string,
  count: number,
  info: string,
}
const OnboardShinyaPage: React.FC<OnBoardTask> = ({ loggedInUser, urlUser, goal, info, count }) => (
  <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Task3Component goal={goal} info={info} count={count}/>
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
  const careergoal = CareerGoals.findOne();
  const goal = CareerGoals.dumpOne(careergoal).name;
  const info = CareerGoals.dumpOne(careergoal).description;
  return {
    loggedInUser,
    urlUser,
    count,
    goal,
    info,
  };
})(OnboardShinyaPage);
// export default OnboardShinyaPage;
