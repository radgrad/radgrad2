import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { useRouteMatch } from 'react-router';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import BrowserView from '../../../components/shared/explorer/browser-view/BrowserView';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';
import { getEntities } from './utilities/getEntities';
import { BrowserViewPageProps } from './utilities/BrowserViewPageProps';

const headerPaneTitle = 'Find the courses you like';
const headerPaneBody = `
The RadGrad course explorer provides helpful information about courses, including reviews by students from previous semesters, as well as the number of students planning to take the course in an upcoming semester. 

 1. Use this explorer to find and add courses to your profile.
 2. Add them in your plan on the Degree Planner page. 
 
Once they are in your plan, RadGrad can update your Competency points and do a better job of community building. 
`;
const headerPaneImage = 'images/header-panel/header-courses.png';


const CourseBrowserViewPage: React.FC<BrowserViewPageProps> = ({ courses, profileCareerGoals, profileCourses, profileInterests, profileOpportunities, careerGoals, interests, opportunities }) => (
  <PageLayout id={PAGEIDS.COURSE_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <BrowserView items={courses} explorerType={EXPLORER_TYPE.COURSES} profileCareerGoals={profileCareerGoals} profileCourses={profileCourses} profileInterests={profileInterests} profileOpportunities={profileOpportunities} careerGoals={careerGoals} courses={courses} interests={interests} opportunities={opportunities} />
  </PageLayout>
);

export default withTracker(() => {
  const match = useRouteMatch();
  return getEntities(match);
})(CourseBrowserViewPage);

