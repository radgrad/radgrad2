import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, Header, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import { Users } from '../../app/imports/api/user/UserCollection';
import { scrollPositionActions } from '../../app/imports/redux/shared/scrollPosition';
import { RootState } from '../../app/imports/redux/types';
import { Course, ProfileCourse } from '../../app/imports/typings/radgrad';
import TermCard from './TermCard';
import { ROLE } from '../../app/imports/api/role/Role';
import CourseFilterWidget, { courseFilterKeys } from './CourseFilterWidget';
import BackToTopButton from '../../app/imports/ui/components/shared/BackToTopButton';

interface CourseBrowserViewProps {
  profileCourses: ProfileCourse[];
  courses: Course[];
  // Saving Scroll Position
  coursesScrollPosition: number;
  setCoursesScrollPosition: (scrollPosition: number) => any;
  filterCoursesChoice: string;
}

const mapStateToProps = (state: RootState) => ({
  coursesScrollPosition: state.shared.scrollPosition.explorer.courses,
  filterCoursesChoice: state.shared.cardExplorer.courses.filterValue,
});

const mapDispatchToProps = (dispatch) => ({
  setCoursesScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerCoursesScrollPosition(scrollPosition)),
});

const CourseBrowserView: React.FC<CourseBrowserViewProps> = ({ profileCourses, courses, coursesScrollPosition, setCoursesScrollPosition, filterCoursesChoice }) => {
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
  switch (filterCoursesChoice) {
    case courseFilterKeys.threeHundredPLus:
      items = items.filter((i) => {
        const courseNumber = parseInt(i.num.split(' ')[1], 10);
        return courseNumber >= 300;
      });
      break;
    case courseFilterKeys.fourHundredPlus:
      items = items.filter((i) => {
        const courseNumber = parseInt(i.num.split(' ')[1], 10);
        return courseNumber >= 400;
      });
      break;
    case courseFilterKeys.sixHundredPlus:
      items = items.filter((i) => {
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
        <CourseFilterWidget />
        <Card.Group itemsPerRow={2} stackable id="coursesCardGroup">
          {items.map((course) => (
            <TermCard key={course._id} type="courses" isStudent={isStudent} canAdd={false} item={course} />
          ))}
        </Card.Group>
        <BackToTopButton />
      </Segment>
    </div>
  );
};

const CourseBrowserViewContainer = connect(mapStateToProps, mapDispatchToProps)(CourseBrowserView);

export default CourseBrowserViewContainer;
