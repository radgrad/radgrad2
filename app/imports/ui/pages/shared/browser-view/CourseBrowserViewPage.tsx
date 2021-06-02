import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Course } from '../../../../typings/radgrad';
import { Courses } from '../../../../api/course/CourseCollection';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import BrowserView from '../../../components/shared/explorer/browser-view/BrowserView';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';

interface CourseBrowserViewPageProps {
  courses: Course[];
}

const headerPaneTitle = 'Find the courses you like';
const headerPaneBody = `
The RadGrad course explorer provides helpful information about courses, including reviews by students from previous semesters, as well as the number of students planning to take the course in an upcoming semester. 

 1. Use this explorer to find and add courses to your profile.
 2. Add them in your plan on the Degree Planner page. 
 
Once they are in your plan, RadGrad can update your Competency points and do a better job of community building. 
`;
const headerPaneImage = 'images/header-panel/header-courses.png';


const CourseBrowserViewPage: React.FC<CourseBrowserViewPageProps> = ({ courses }) => (
  <PageLayout id={PAGEIDS.COURSE_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <BrowserView items={courses} explorerType={EXPLORER_TYPE.COURSES} />
  </PageLayout>
);

export default withTracker(() => {
  const courses = Courses.findNonRetired({});
  return {
    courses,
  };
})(CourseBrowserViewPage);

