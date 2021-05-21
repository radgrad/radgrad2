import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { Users } from '../../../../api/user/UserCollection';
import PageLayout from '../../PageLayout';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';

const headerPaneTitle = "Timothy's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

interface OnBoardVar {
  user: string;
  urlName: string;
}

const OnboardTimothyPage: React.FC<OnBoardVar> = ({ user, urlName }) => (
    <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
                headerPaneImage={headerPaneImage}>
        <div className='ui two column grid'>
            <div className='column'>
                <RadGradSegment header={<RadGradHeader title='TASK 1: HELLO WORLD' icon='globe americas'/>}>
                    Hello World
                </RadGradSegment>
            </div>
            <div className='column'>
                <RadGradSegment header={<RadGradHeader title='TASK 2: WHO IS THE USER?' icon='user graduate'/>}>
                    The current logged in user is: {user}
                    <br/>
                    <br/>
                    The username appearing in the URL is: {urlName}
                    <br/>
                    <br/>
                    In RadGrad, these are not necessarily the same!
                </RadGradSegment>
            </div>
        </div>
    </PageLayout>
);

export default withTracker(() => {
  const user = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();
  const urlName = Users.getProfile(username).username;
  return {
    user,
    urlName,
  };
})(OnboardTimothyPage);
