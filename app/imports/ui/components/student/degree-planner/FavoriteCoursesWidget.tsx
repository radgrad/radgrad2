import React from 'react';
import { Card, Icon, Message } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { ICourse, ICourseInstance } from '../../../../typings/radgrad';
import * as Router from '../../shared/utilities/router';
import FavoriteCourseCard from './FavoriteCourseCard';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';

interface IFavoriteCoursesWidgetProps {
  studentID: string;
  courses: ICourse[];
  courseInstances: ICourseInstance[];
}

const FavoriteCoursesWidget: React.FC<IFavoriteCoursesWidgetProps> = (props) => {
  const match = useRouteMatch();
  const hasFavorites = props.courses.length > 0;
  return (
    <div>
      {hasFavorites ?
        (
          <Card.Group itemsPerRow={1}>
            {_.map(props.courses, (c) => <FavoriteCourseCard key={c._id} course={c} studentID={props.studentID} courseInstances={props.courseInstances} />)}
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

export default FavoriteCoursesWidget;
