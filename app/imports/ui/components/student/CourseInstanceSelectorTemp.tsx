import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import _ from 'lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { Users } from '../../../api/user/UserCollection';
import { degreePlannerActions } from '../../../redux/student/degree-planner';

interface IConnectedCourseInstanceSelectorTempProps {
  selectCourseInstance: (courseInstanceID: string) => any;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
});

const ConnectedCourseInstanceSelectorTemp = (props: IConnectedCourseInstanceSelectorTempProps) => {
  const [courseInstanceID, setCourseInstanceID] = useState('');

  const handleChange = (event, { value }) => {
    event.preventDefault();
    // console.log(value);
    setCourseInstanceID(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(courseInstanceID);
    props.selectCourseInstance(courseInstanceID);
  };

  const userName = props.match.params.username;
  const studentID = Users.getID(userName);
  const courseInstances = CourseInstances.findNonRetired({ studentID });
  const options = [];
  _.forEach(courseInstances, (c) => {
    options.push({
      key: c._id,
      text: c.note,
      value: c._id,
    });
  });
  // console.log(options);
  return (
    <Form>
      <Form.Select
        fluid
        label="Course Instance"
        options={options}
        placeholder="Course Instance"
        onChange={handleChange}
      />
      <Form.Button onClick={handleSubmit}>Submit</Form.Button>
    </Form>
  );
};

const ConnectedCourseInstanceSelectorTempCon = withGlobalSubscription(ConnectedCourseInstanceSelectorTemp);
const ConnectedCourseInstanceSelectorTempCont = withInstanceSubscriptions(ConnectedCourseInstanceSelectorTempCon);

const ConnectedCourseInstanceSelectorTempConta = withRouter(ConnectedCourseInstanceSelectorTempCont);

const ConnectedCourseInstanceSelectorTempContainer = connect(null, mapDispatchToProps)(ConnectedCourseInstanceSelectorTempConta);
export default ConnectedCourseInstanceSelectorTempContainer;
