import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import { Form } from 'semantic-ui-react';
import _ from 'lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { ICourse } from '../../../typings/radgrad';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { degreePlannerActions } from '../../../redux/student/degree-planner';

interface IConnectedCourseSelectorTempProps {
  courses: ICourse[];
  selectCourse: (courseID: string) => any;
}


const mapDispatchToProps = (dispatch) => ({
  selectCourse: (courseID) => dispatch(degreePlannerActions.selectCourse(courseID)),
});

const ConnectedCourseSelectorTemp = (props: IConnectedCourseSelectorTempProps) => {
  const [courseID, setCourseID] = useState('');

  const handleChange = (event, { value }) => {
    event.preventDefault();
    // console.log(value);
    setCourseID(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(courseID);
    props.selectCourse(courseID);
  };

  const options = [];
  _.forEach(props.courses, (c) => {
    options.push({
      key: c._id,
      text: c.shortName,
      value: c._id,
    });
  });
  // console.log(options);
  return (
    <Form>
      <Form.Select fluid label="Course" options={options} placeholder="Course" onChange={handleChange} />
      <Form.Button onClick={handleSubmit}>Submit</Form.Button>
    </Form>
  );
};

const ConnectedCourseSelectorTempCon = withGlobalSubscription(ConnectedCourseSelectorTemp);
const ConnectedCourseSelectorTempCont = withInstanceSubscriptions(ConnectedCourseSelectorTempCon);

const ConnectedCourseSelectorTempConta = withTracker(() => ({
  courses: Courses.findNonRetired({}, { sort: { shortName: 1 } }),
  count: Courses.countNonRetired(),
}))(ConnectedCourseSelectorTempCont);

const ConnectedCourseSelectorTempContainer = connect(null, mapDispatchToProps)(ConnectedCourseSelectorTempConta);
export default ConnectedCourseSelectorTempContainer;
