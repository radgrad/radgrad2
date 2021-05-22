import { Meteor } from 'meteor/meteor';
import React from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import PageLayout from '../../PageLayout';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';

const headerPaneTitle = "Timothy's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

interface OnBoardVar {
  user: string;
  urlName: string;
  TotalCareerGoals: string;
  randomName: string;
  randomDescription: string;
}

const OnboardTimothyPage: React.FC<OnBoardVar> = ({ user, urlName, TotalCareerGoals, randomName, randomDescription }) => {
  const profileItems = TotalCareerGoals.length;
  return (
        <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
                    headerPaneImage={headerPaneImage}>
            <div>
                <RadGradSegment header={<RadGradHeader title='TASK 3: A RANDOM CAREER GOAL (REFRESH FOR A NEW ONE)' icon='database'/>}>
                    <div className='ui vertical segment'>
                        <h3 className='ui header' style={{ marginBottom: '1em' }}> {randomName} </h3>
                        <Markdown escapeHtml source={randomDescription} />
                    </div>
                    <div className='ui vertical segment'>
                        Note: The total number of career goals is: {profileItems}
                    </div>
                </RadGradSegment>
            </div>
            <br/>
            <br/>
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
};

export default withTracker(() => {
  const user = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();
  const TotalCareerGoals = CareerGoals.find({}).fetch();
  const random = _.sample(TotalCareerGoals);
  const randomName  = random.name;
  const randomDescription = random.description;
  const urlName = Users.getProfile(username).username;
  return {
    user,
    urlName,
    TotalCareerGoals,
    randomName,
    randomDescription,
  };
})(OnboardTimothyPage);
