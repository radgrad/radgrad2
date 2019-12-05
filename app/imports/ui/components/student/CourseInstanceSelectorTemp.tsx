import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import * as _ from 'lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { ICourse } from '../../../typings/radgrad'; // eslint-disable-line
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { Users } from '../../../api/user/UserCollection';
import { degreePlannerActions } from '../../../redux/student/degree-planner';

interface IConnectedCourseInstanceSelectorTempProps {
  courseInstances: ICourse[];
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

interface IConnectedCourseInstanceSelectorTempState {
  courseInstanceID?: string;
}

const mapDispatchToProps = (dispatch) => ({
    selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
  });

class ConnectedCourseInstanceSelectorTemp extends React.Component<IConnectedCourseInstanceSelectorTempProps, IConnectedCourseInstanceSelectorTempState> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  private handleChange = (event, { value }) => {
    event.preventDefault();
    // console.log(value);
    this.setState({ courseInstanceID: value });
  }

  private handleSubmit = (event) => {
    event.preventDefault();
    const { courseInstanceID } = this.state;
    // console.log(courseInstanceID);
    this.props.selectCourseInstance(courseInstanceID);
  }

  public render() {
    const userName = this.props.match.params.username;
    const studentID = Users.getID(userName);
    const courseInstances = CourseInstances.find({ studentID }).fetch();
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
        <Form.Select fluid={true} label="Course Instance" options={options} placeholder="Course Instance" onChange={this.handleChange}/>
        <Form.Button onClick={this.handleSubmit}>Submit</Form.Button>
      </Form>
    );
  }
}

const ConnectedCourseInstanceSelectorTempCon = withGlobalSubscription(ConnectedCourseInstanceSelectorTemp);
const ConnectedCourseInstanceSelectorTempCont = withInstanceSubscriptions(ConnectedCourseInstanceSelectorTempCon);

const ConnectedCourseInstanceSelectorTempConta = withRouter(ConnectedCourseInstanceSelectorTempCont);

const ConnectedCourseInstanceSelectorTempContainer = connect(null, mapDispatchToProps)(ConnectedCourseInstanceSelectorTempConta);
export default ConnectedCourseInstanceSelectorTempContainer;
