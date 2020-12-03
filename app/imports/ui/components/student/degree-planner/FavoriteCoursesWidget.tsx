import React from 'react';
import { Card, Icon, Message } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { ICourse } from '../../../../typings/radgrad';
import * as Router from '../../shared/utilities/router';
import { FavoriteCourses } from '../../../../api/favorite/FavoriteCourseCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import FavoriteCourseCard from './FavoriteCourseCard';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Users } from '../../../../api/user/UserCollection';

interface IFavoriteCoursesWidgetProps {
  studentID: string;
  courses: ICourse[];
}

const FavoriteCoursesWidget = (props: IFavoriteCoursesWidgetProps) => {
  const match = useRouteMatch();
  const hasFavorites = props.courses.length > 0;
  return (
    <div>
      {hasFavorites ?
        (
          <Card.Group itemsPerRow={1}>
            {_.map(props.courses, (c) => <FavoriteCourseCard key={c._id} course={c} studentID={props.studentID} />)}
          </Card.Group>
        )
        :
        (
          <Message>
            <Message.Header>No Favorite Courses</Message.Header>
            <p>You can favorite courses in the explorer.</p>
            <Link to={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`)}>
              View in Explorer <Icon name="arrow right" />
            </Link>
          </Message>
        )}
    </div>
  );
};

export default withTracker((props) => {
  const { username } = useParams();
  const studentID = Users.getProfile(username).userID;
  const favorites = FavoriteCourses.findNonRetired({ studentID });
  const courses = _.map(favorites, (f) => Courses.findDoc(f.courseID));
  return {
    studentID,
    courses,
  };
})(FavoriteCoursesWidget);
