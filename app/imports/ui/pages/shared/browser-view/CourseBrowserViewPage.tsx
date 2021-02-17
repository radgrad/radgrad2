import moment from 'moment';
import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../../api/role/Role';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { Course, FavoriteCourse, StudentProfileUpdate } from '../../../../typings/radgrad';
import * as Router from '../../../components/shared/utilities/router';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Courses } from '../../../../api/course/CourseCollection';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import { Users } from '../../../../api/user/UserCollection';
import { FavoriteCourses } from '../../../../api/favorite/FavoriteCourseCollection';
import CourseBrowserViewContainer from '../../../components/shared/explorer/browser-view/CourseBrowserView';
import PageLayout from '../../PageLayout';

interface CourseBrowserViewPageProps {
  favoriteCourses: FavoriteCourse[];
  courses: Course[];
}

const headerPaneTitle = 'Find the courses you like';
const headerPaneBody = `
The RadGrad course explorer provides helpful information about courses, including reviews by students from previous semesters, as well as the number of students planning to take the course in an upcoming semester. 

 1. Use this explorer to find and add courses to your profile.
 2. Add them in your plan on the Degree Planner page. 
 
Once they are in your plan, RadGrad can update your Competency points and do a better job of community building. 
`;

const CourseBrowserViewPage: React.FC<CourseBrowserViewPageProps> = ({ favoriteCourses, courses }) => {
  const match = useRouteMatch();
  const favoriteCourseDocs = _.map(favoriteCourses, (f) => Courses.findDoc(f.courseID));
  const menuAddedList = _.map(favoriteCourseDocs, (c) => ({ item: c, count: 1 })); // TODO why supply count?
  const role = Router.getRoleByUrl(match);
  const showFavorites = role === 'student';
  const columnWidth = showFavorites ? 12 : 16;
  return (
    <PageLayout id="course-browser-view-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <Grid stackable>
        <Grid.Row>
          {showFavorites ? (
            <Grid.Column width={4}>
              <ExplorerMultipleItemsMenu menuAddedList={menuAddedList} type={EXPLORER_TYPE.COURSES as IExplorerTypes}
                                         menuCareerList={undefined}/>
            </Grid.Column>
          ) : (
            ' '
          )}
          <Grid.Column width={columnWidth}>
            <CourseBrowserViewContainer favoriteCourses={favoriteCourses} courses={courses}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  if (profile.role === ROLE.STUDENT) {
    const lastVisited = moment().format('YYYY-MM-DD');
    if (lastVisited !== profile.lastVisitedCourses) {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = profile._id;
      updateData.lastVisitedCourses = lastVisited;
      updateMethod.call({ collectionName, updateData }, (error, result) => {
        if (error) {
          console.error('Error updating StudentProfile', collectionName, updateData, error);
        }
      });
    }
  }
  const studentID = profile.userID;
  const favoriteCourses = FavoriteCourses.findNonRetired({ studentID });
  const courses = Courses.findNonRetired({}); // TODO if user is undergrad student why are we showing grad courses?
  return {
    courses,
    favoriteCourses,
  };
})(CourseBrowserViewPage);
