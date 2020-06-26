import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { ICourse } from '../../../typings/radgrad';
import { ROLE } from '../../../api/role/Role';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import { Users } from '../../../api/user/UserCollection';
import { profileFavoriteBamAcademicPlan } from '../shared/data-model-helper-functions';

interface IInpectorCourseMenuProps {
  studentID: string;
  selectCourse: (courseID: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  selectCourse: (courseID) => dispatch(degreePlannerActions.selectCourse(courseID)),
});

function courseStructureForMenu(userID) {
  let courses = Courses.findNonRetired({}, { sort: { num: 1 } });
  courses = _.reject(courses, ['num', 'other']);
  const profile = Users.getProfile(userID);
  if (profile.role === ROLE.STUDENT) {
    const bam = profileFavoriteBamAcademicPlan(profile);
    if (!bam) { // not bachelors and masters
      const regex = /[1234]\d\d/g;
      courses = _.filter(courses, (c: ICourse) => c.num.match(regex));
    }
  }
  // console.log(courses.length);
  courses = _.filter(courses, (course) => {
    if (course.num === 'ICS 499') { // TODO: hardcoded ICS string
      return true;
    }
    const ci = CourseInstances.find({
      studentID: userID,
      courseID: course._id,
    }).fetch();
    return ci.length === 0;
  });
  const courseStructure = [];
  while (courses.length > 0) {
    const subarray = [];
    for (let i = 0; i < 10; i++) {
      if (courses.length > 0) {
        subarray.push(courses.shift());
      }
    }
    courseStructure.push(subarray);
  }
  // console.log(courseStructure);
  return courseStructure;
}

function coursesLabel(courses) {
  return `${courses[0].num} - ${courses[courses.length - 1].num}`;
}

const InspectorCourseMenu = (props: IInpectorCourseMenuProps) => {
  // console.log('InspectorCourseMenu', props);

  const handleClick = (event, { value }) => {
    event.preventDefault();
    props.selectCourse(value);
  };

  const courseMenuStructure = courseStructureForMenu(props.studentID);
  return (
    <Dropdown text="Courses">
      <Dropdown.Menu>
        {_.map(courseMenuStructure, (courses, index) => (
          <Dropdown.Item key={index}>
            <Dropdown text={coursesLabel(courses)}>
              <Dropdown.Menu>
                {_.map(courses, (c) => (
                  <Dropdown.Item key={c._id} value={c._id} onClick={handleClick}>
                    {c.num} {c.shortName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const InspectorCourseMenuContainer = connect(null, mapDispatchToProps)(InspectorCourseMenu);
export default InspectorCourseMenuContainer;
