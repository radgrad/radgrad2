import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { Container, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Course, FavoriteCourse, HelpMessage } from '../../../../typings/radgrad';
import * as Router from '../../../components/shared/utilities/router';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Courses } from '../../../../api/course/CourseCollection';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import { Users } from '../../../../api/user/UserCollection';
import { FavoriteCourses } from '../../../../api/favorite/FavoriteCourseCollection';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import CourseBrowserViewContainer from '../../../components/shared/explorer/browser-view/CourseBrowserView';
import { getMenuWidget } from '../utilities/getMenuWidget';

interface CourseBrowserViewPageProps {
  favoriteCourses: FavoriteCourse[];
  courses: Course[];
  helpMessages: HelpMessage[];
}

const CourseBrowserViewPage: React.FC<CourseBrowserViewPageProps> = ({ favoriteCourses, courses, helpMessages }) => {
  const match = useRouteMatch();
  const favoriteCourseDocs = _.map(favoriteCourses, (f) => Courses.findDoc(f.courseID));
  const menuAddedList = _.map(favoriteCourseDocs, (c) => ({ item: c, count: 1 })); // TODO why supply count?
  const role = Router.getRoleByUrl(match);
  const showFavorites = role === 'student';
  const columnWidth = showFavorites ? 12 : 16;
  return (
    <div id="course-browser-view-page">
      {getMenuWidget(match)}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {showFavorites ? (
              <Grid.Column width={4}>
                <ExplorerMultipleItemsMenu
                  menuAddedList={menuAddedList}
                  type={EXPLORER_TYPE.COURSES as IExplorerTypes}
                  menuCareerList={undefined}
                />
              </Grid.Column>
            ) : ' '}
            <Grid.Column width={columnWidth}>
              <CourseBrowserViewContainer favoriteCourses={favoriteCourses} courses={courses} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
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
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    courses,
    favoriteCourses,
    helpMessages,
  };
})(CourseBrowserViewPage);
