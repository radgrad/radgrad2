import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, Header, Segment } from 'semantic-ui-react';
import { Users } from '../../../../../api/user/UserCollection';
import { scrollPositionActions } from '../../../../../redux/shared/scrollPosition';
import { RootState } from '../../../../../redux/types';
import { ICourse, IFavoriteCourse } from '../../../../../typings/radgrad';
import TermCard from './TermCard';
import { ROLE } from '../../../../../api/role/Role';
import CourseFilterWidget, { courseFilterKeys } from './CourseFilterWidget';
import _ from 'lodash';

interface ICourseBrowserViewProps {
  favoriteCourses: IFavoriteCourse[];
  courses: ICourse[];
  // Saving Scroll Position
  coursesScrollPosition: number;
  setCoursesScrollPosition: (scrollPosition: number) => any;
}

const mapStateToProps = (state: RootState) => ({
  coursesScrollPosition: state.shared.scrollPosition.explorer.courses,
});

const mapDispatchToProps = (dispatch) => ({
  setCoursesScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerCoursesScrollPosition(scrollPosition)),
});

const CourseBrowserView: React.FC<ICourseBrowserViewProps> = ({ favoriteCourses, courses, coursesScrollPosition, setCoursesScrollPosition }) => {
  const [filterCoursesChoiceState, setFilterCoursesChoice] = useState(courseFilterKeys.none);

  const { username } = useParams();
  const profile = Users.getProfile(username);
  const isStudent = profile.role === ROLE.STUDENT;
  const cardGroupElement: HTMLElement = document.getElementById('coursesCardGroup');
  useEffect(() => {
    const savedScrollPosition = coursesScrollPosition;
    if (savedScrollPosition && cardGroupElement) {
      cardGroupElement.scrollTo(0, savedScrollPosition);
    }
    return () => {
      if (cardGroupElement) {
        const currentScrollPosition = cardGroupElement.scrollTop;
        setCoursesScrollPosition(currentScrollPosition);
      }
    };
  }, [cardGroupElement, coursesScrollPosition, setCoursesScrollPosition]);

  let items = _.sortBy(courses, (item) => item.num);
  switch (filterCoursesChoiceState) {
    case courseFilterKeys.threeHundredPLus:
      items = _.filter(items, (i) => {
        const courseNumber = parseInt(i.num.split(' ')[1], 10);
        return courseNumber >= 300;
      });
      break;
    case courseFilterKeys.fourHundredPlus:
      items = _.filter(items, (i) => {
        const courseNumber = parseInt(i.num.split(' ')[1], 10);
        return courseNumber >= 400;
      });
      break;
    case courseFilterKeys.sixHundredPlus:
      items = _.filter(items, (i) => {
        const courseNumber = parseInt(i.num.split(' ')[1], 10);
        return courseNumber >= 600;
      });
      break;
    default:
    // do no filtering
  }

  return (
    <div id="course-browser-view">
      <Segment>
        <Header dividing>COURSES {courses.length}</Header>
        <CourseFilterWidget
          filterChoice={filterCoursesChoiceState}
          handleChange={(key, value) => {
            setFilterCoursesChoice(value);
          }}
        />
        <Card.Group itemsPerRow={2} stackable id="coursesCardGroup">
          {items.map((course) => (<TermCard key={course._id} type="courses" isStudent={isStudent} canAdd={false} item={course} />))}
        </Card.Group>
      </Segment>
    </div>
  );
};

const CourseBrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(CourseBrowserView);

export default CourseBrowserViewContainer;
