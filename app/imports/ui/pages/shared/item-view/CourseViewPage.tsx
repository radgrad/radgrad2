import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid } from 'semantic-ui-react';
import _ from 'lodash';
import { getMenuWidget } from '../utilities/getMenuWidget';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import ExplorerMenu from '../../../components/shared/explorer/item-view/ExplorerMenu';
import { ICourse, IDescriptionPair, IFavoriteCourse, IHelpMessage } from '../../../../typings/radgrad';
import { Courses } from '../../../../api/course/CourseCollection';
import { FavoriteCourses } from '../../../../api/favorite/FavoriteCourseCollection';
import { Users } from '../../../../api/user/UserCollection';
import ExplorerCourseWidget from '../../../components/shared/explorer/item-view/course/ExplorerCourseWidget';
import { Interests } from '../../../../api/interest/InterestCollection';

interface ICourseViewPageProps {
  favoriteCourses: IFavoriteCourse[];
  course: ICourse;
  helpMessages: IHelpMessage[];
}

const descriptionPairsCourses = (theCourse: ICourse, props: IIndividualExplorerPageProps): IDescriptionPair[] => [
  { label: 'Course Number', value: theCourse.num },
  { label: 'Credit Hours', value: theCourse.creditHrs },
  { label: 'Description', value: theCourse.description },
  { label: 'Syllabus', value: theCourse.syllabus },
  { label: 'Interests', value: _.sortBy(Interests.findNames(theCourse.interestIDs)) },
  { label: 'Prerequisites', value: prerequisites(theCourse, props) },
  { label: 'Teaser', value: teaser(theCourse) },
];

const CourseViewPage: React.FC<ICourseViewPageProps> = ({ favoriteCourses, course, helpMessages }) => {
  const match = useRouteMatch();
  const menuAddedList = _.map(favoriteCourses, (f) => ({
    item: Courses.findDoc(f.courseID), count: 1,
  }));
  return (
    <div id="course-view-page">
      {getMenuWidget(match)}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <ExplorerMenu menuAddedList={menuAddedList} type="courses" />
            </Grid.Column>
            <Grid.Column width={13}>
              <ExplorerCourseWidget name={course.name} shortName={course.shortName} descriptionPairs={} item={course} completed={} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

const CourseViewPageContainer = withTracker(() => {
  const { course, username } = useParams();
  const courseDoc = Courses.findDocBySlug(course);
  const profile = Users.getProfile(username);
  const favoriteCourses = FavoriteCourses.findNonRetired({ studentID: profile.userID });
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    course: courseDoc,
    favoriteCourses,
    helpMessages,
  };
})(CourseViewPage);

export default CourseViewPageContainer;
