import React from 'react';
import { Card, Icon, Message } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { ICourse } from '../../../../typings/radgrad';
import * as Router from '../../shared/RouterHelperFunctions';
import { FavoriteCourses } from '../../../../api/favorite/FavoriteCourseCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import FavoriteCourseCard from './FavoriteCourseCard';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';

interface IFavoriteCoursesWidgetProps {
  match: Router.IMatchProps;
  studentID: string;
  courses: ICourse[];
}

const FavoriteCoursesWidget = (props: IFavoriteCoursesWidgetProps) => {
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
            <Link to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`)}>
              View in Explorer <Icon name="arrow right" />
            </Link>
          </Message>
        )}
    </div>
  );
};

export default withRouter(withTracker((props) => {
  const studentID = Router.getUserIdFromRoute(props.match);
  const favorites = FavoriteCourses.find({ studentID }).fetch();
  const courses = _.map(favorites, (f) => Courses.findDoc(f.courseID));
  return {
    studentID,
    courses,
  };
})(FavoriteCoursesWidget));
