import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { useRouteMatch } from 'react-router';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import BrowserView from '../../../components/shared/explorer/browser-view/BrowserView';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';
import { getEntities } from './utilities/getEntities';
import { BrowserViewPageProps } from './utilities/BrowserViewPageProps';

const headerPaneTitle = 'Find interesting opportunities';
const headerPaneBody = `
Your degree experience isn't complete if you don't take advantage of extracurricular activities, which RadGrad calls **Opportunities**. An Opportunity can give you the chance to be Innovative and/or obtain professional Experience. 

 1. Use this explorer to find and add opportunities to your profile.
 2. Add them in your plan on the Degree Planner page. 
 
Once they are in your plan, RadGrad can update your Innovation and Experience points and do a better job of community building. 
`;
const headerPaneImage = 'images/header-panel/header-opportunities.png';

const OpportunityBrowserViewPage: React.FC<BrowserViewPageProps> = ({ opportunities, profileCareerGoals, profileCourses, profileInterests, profileOpportunities, careerGoals, courses, interests }) => (
  <PageLayout id={PAGEIDS.OPPORTUNITY_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <BrowserView items={opportunities} explorerType={EXPLORER_TYPE.OPPORTUNITIES} profileCareerGoals={profileCareerGoals} profileCourses={profileCourses} profileInterests={profileInterests} profileOpportunities={profileOpportunities} careerGoals={careerGoals} courses={courses} interests={interests} opportunities={opportunities} />
  </PageLayout>
);

export default withTracker(() => {
  const match = useRouteMatch();
  return getEntities(match);
})(OpportunityBrowserViewPage);
