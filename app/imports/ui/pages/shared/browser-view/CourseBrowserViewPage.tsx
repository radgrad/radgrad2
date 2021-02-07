import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Course, FavoriteCourse } from '../../../../typings/radgrad';
import * as Router from '../../../components/shared/utilities/router';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Courses } from '../../../../api/course/CourseCollection';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import { Users } from '../../../../api/user/UserCollection';
import { FavoriteCourses } from '../../../../api/favorite/FavoriteCourseCollection';
import CourseBrowserViewContainer from '../../../components/shared/explorer/browser-view/CourseBrowserView';
import { getMenuWidget } from '../utilities/getMenuWidget';
import HeaderPane from '../../../components/shared/HeaderPane';

interface CourseBrowserViewPageProps {
  favoriteCourses: FavoriteCourse[];
  courses: Course[];
}

const CourseBrowserViewPage: React.FC<CourseBrowserViewPageProps> = ({ favoriteCourses, courses }) => {
  const match = useRouteMatch();
  const favoriteCourseDocs = _.map(favoriteCourses, (f) => Courses.findDoc(f.courseID));
  const menuAddedList = _.map(favoriteCourseDocs, (c) => ({ item: c, count: 1 })); // TODO why supply count?
  const role = Router.getRoleByUrl(match);
  const showFavorites = role === 'student';
  const columnWidth = showFavorites ? 12 : 16;
  return (
    <div id="course-browser-view-page">
      {getMenuWidget(match)}
      <HeaderPane
        title="Course Explorer"
        line1="The RadGrad course explorer provides unique information about courses, including reviews by students from previous semesters, as well as the number of students planning to take the course in an upcoming semester. "
        line2="Use this page to add courses to your profile, then put them in your plan on the Degree Planner page. Once they are in your plan, RadGrad can update your total expected Competency points. "
      />
        <Grid stackable style={{marginLeft: '10px', marginRight: '10px'}}>
          <Grid.Row>
            {showFavorites ? (
              <Grid.Column width={4}>
                <ExplorerMultipleItemsMenu menuAddedList={menuAddedList} type={EXPLORER_TYPE.COURSES as IExplorerTypes} menuCareerList={undefined} />
              </Grid.Column>
            ) : (
              ' '
            )}
            <Grid.Column width={columnWidth}>
              <CourseBrowserViewContainer favoriteCourses={favoriteCourses} courses={courses} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
    </div>
  );
};

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  // console.log(profile);
  const studentID = profile.userID;
  const favoriteCourses = FavoriteCourses.findNonRetired({ studentID });
  const courses = Courses.findNonRetired({}); // TODO if user is undergrad student why are we showing grad courses?
  return {
    courses,
    favoriteCourses,
  };
})(CourseBrowserViewPage);
