import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { useRouteMatch } from 'react-router';
import BrowserView from '../../../components/shared/explorer/browser-view/BrowserView';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';
import { getEntities } from './utilities/getEntities';
import { BrowserViewPageProps } from './utilities/BrowserViewPageProps';

const headerPaneTitle = 'Find your career goals';
const headerPaneBody = `
Career Goals are curated by the faculty to represent a good selection of the most promising career paths. Most career goals encompass several job titles. 

Specify at least three career goals so RadGrad can recommend related courses, opportunities, and community members.

If we've missed a career goal of interest to you, please click the button below to ask a RadGrad administrator to add it to the system. 
`;
const headerPaneImage = 'images/header-panel/header-career.png';

const CareerGoalBrowserViewPage: React.FC<BrowserViewPageProps> = ({ careerGoals, profileCareerGoals, profileCourses, profileInterests, profileOpportunities, courses, interests, opportunities }) => (
  <PageLayout id={PAGEIDS.CAREER_GOAL_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <BrowserView items={careerGoals} explorerType={EXPLORER_TYPE.CAREERGOALS} profileCareerGoals={profileCareerGoals} profileCourses={profileCourses} profileInterests={profileInterests} profileOpportunities={profileOpportunities} careerGoals={careerGoals} courses={courses} interests={interests} opportunities={opportunities} />
  </PageLayout>
);

export default withTracker(() => {
  const match = useRouteMatch();
  return getEntities(match);
})(CareerGoalBrowserViewPage);
