import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown } from 'semantic-ui-react';
import { selectCourse } from '../../../redux/actions/actions';
import { Courses } from '../../../api/course/CourseCollection';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { ICourse } from '../../../typings/radgrad';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../../api/role/Role';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';

interface IInpectorCourseMenuProps {
  studentID: string;
  selectCourse: (courseID: string) => any;
}

interface IInspectorCourseMenuState {
  courseID?: string;
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectCourse: (courseID) => dispatch(selectCourse(courseID)),
  };
};

function courseStructureForMenu(userID) {
  let courses = Courses.findNonRetired({}, { sort: { num: 1 } });
  courses = _.filter(courses, (c: ICourse) => c.num !== 'other');
  if (Roles.userIsInRole(userID, [ROLE.STUDENT])) {
    const profile = StudentProfiles.findDoc({ userID });
    const plan = AcademicPlans.findDoc(profile.academicPlanID);
    if (!plan || plan.coursesPerAcademicTerm.length < 15) { // not bachelors and masters
      const regex = /[1234]\d\d/g;
      courses = _.filter(courses, (c: ICourse) => c.num.match(regex));
    }
  }
  // console.log(courses.length);
  courses = _.filter(courses, (course) => {
    if (course.number === 'ICS 499') {
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

class InspectorCourseMenu extends React.Component<IInpectorCourseMenuProps, IInspectorCourseMenuState> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {};
  }

  private handleClick(event, { value }) {
    event.preventDefault();
    this.props.selectCourse(value);
  }

  public render() {
    // console.log(this.props);
    const courseMenuStructure = courseStructureForMenu(this.props.studentID);
    return (
      <Dropdown text="Courses">
        <Dropdown.Menu>
          {_.map(courseMenuStructure, (courses, index) => (
            <Dropdown.Item key={index}>
              <Dropdown text={coursesLabel(courses)}>
                <Dropdown.Menu>
                  {_.map(courses, (c) => (
                    <Dropdown.Item key={c._id} value={c._id} onClick={this.handleClick}>{c.num} {c.shortName}</Dropdown.Item>))}
                </Dropdown.Menu>
              </Dropdown>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const InspectorCourseMenuContainer = connect(null, mapDispatchToProps)(InspectorCourseMenu);
export default InspectorCourseMenuContainer;
