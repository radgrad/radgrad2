import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { useRouteMatch } from 'react-router';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';
import BrowserView from '../../../components/shared/explorer/browser-view/BrowserView';
import { getEntities } from './utilities/getEntities';
import { BrowserViewPageProps } from './utilities/BrowserViewPageProps';

const headerPaneTitle = 'Find your interests';
const headerPaneBody = `
Interests specify disciplinary areas as well as other areas with a strong overlap.

Specify at least three interests so RadGrad can recommend related courses, opportunities, and community members.

If we've missed a disciplinary area of interest to you, please click the button below to ask a RadGrad administrator to add it to the system. 
`;
const headerPaneImage = 'images/header-panel/header-interests.png';

const InterestBrowserViewPage: React.FC<BrowserViewPageProps> = ({ interests, profileCareerGoals, profileCourses, profileInterests, profileOpportunities, careerGoals, courses, opportunities }) => (
  <PageLayout id={PAGEIDS.INTEREST_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <BrowserView items={interests} explorerType={EXPLORER_TYPE.INTERESTS} profileCareerGoals={profileCareerGoals} profileCourses={profileCourses} profileInterests={profileInterests} profileOpportunities={profileOpportunities} careerGoals={careerGoals} courses={courses} interests={interests} opportunities={opportunities} />
  </PageLayout>
);

export default withTracker(() => {
  const match = useRouteMatch();
  return getEntities(match);
})(InterestBrowserViewPage);
