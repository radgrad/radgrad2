import * as React from 'react';
import { Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ICourse } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { getUserIdFromRoute } from '../shared/RouterHelperFunctions';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { Courses } from '../../../api/course/CourseCollection';
import FavoriteCourseCard from './FavoriteCourseCard';

interface IFavoriteCoursesWidgetProps {
  match: object;
  studentID: string;
  courses: ICourse[];
}

const FavoriteCoursesWidget = (props: IFavoriteCoursesWidgetProps) => (
  <Card.Group itemsPerRow={1}>
    {_.map(props.courses, (c) => <FavoriteCourseCard key={c._id} course={c} studentID={props.studentID}/>)}
  </Card.Group>
);

export default withRouter(withTracker((props) => {
  const studentID = getUserIdFromRoute(props.match);
  const favorites = FavoriteCourses.findNonRetired({ studentID });
  const courses = _.map(favorites, (f) => Courses.findDoc(f.courseID));
  return {
    studentID,
    courses,
  };
})(FavoriteCoursesWidget));
