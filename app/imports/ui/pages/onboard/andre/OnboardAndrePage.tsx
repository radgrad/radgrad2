import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router-dom';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';

const headerPaneTitle = "Andre's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardAndrePage: React.FC = () => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();
  const urlUser = Users.getProfile(username).username;
  const randomCareer = CareerGoals;

  return (
    <PageLayout id={PAGEIDS.ONBOARD_ANDRE} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <RadGradSegment header={<RadGradHeader title='Task Three: A Random Career Goal (Refresh For A New One)' icon='database'/>}>
        Hey
      </RadGradSegment>
      <RadGradSegment header={<RadGradHeader title='Task One: Hello World' icon='globe americas' />}>
        Hello World
      </RadGradSegment>
      <RadGradSegment header={<RadGradHeader title='Task Two: Who Is The User?' icon='user graduate'/>}>
        The currently logged in user is: {currentUser} <br/>
        The username appearing in the URL is: {urlUser} <br/>
        In RadGrad, these are not necessarily the same!
      </RadGradSegment>
    </PageLayout>
  );
};

export default OnboardAndrePage;
