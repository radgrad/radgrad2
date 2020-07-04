import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ICourse, IOpportunity } from '../../../typings/radgrad';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import InspectorCourseMenuContainer from './InspectorCourseMenu';
import InspectorOpportunityMenuContainer from './InspectorOpportunityMenu';
import InspectorOpportunityViewContainer from './InspectorOpportunityView';
import InspectorCourseViewContainer from './InspectorCourseView';
import { RootState } from '../../../redux/types';

interface ICOInspectorWidgetProps {
  selectedCourseID: string;
  selectedCourseInstanceID: string;
  selectedOpportunityID: string;
  selectedOpportunityInstanceID: string;
  courses: ICourse[];
  opportunities: IOpportunity[];
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const mapStateToProps = (state: RootState) => ({
  selectedCourseID: state.student.degreePlanner.inspector.selectedCourseID,
  selectedCourseInstanceID: state.student.degreePlanner.inspector.selectedCourseInstanceID,
  selectedOpportunityID: state.student.degreePlanner.inspector.selectedOpportunityID,
  selectedOpportunityInstanceID: state.student.degreePlanner.inspector.selectedOpportunityInstanceID,
});

const CourseOpportunityInspectorWidget = (props: ICOInspectorWidgetProps) => {
  const userName = props.match.params.username;
  const studentID = Users.getID(userName);
  const padddingBottomStyle = {
    paddingBottom: 0,
  };
  let courseID;
  if (props.selectedCourseInstanceID) {
    const courseInstance = CourseInstances.findDoc(props.selectedCourseInstanceID);
    courseID = courseInstance.courseID;
  }
  let opportunityID;
  if (props.selectedOpportunityInstanceID) {
    const instance = OpportunityInstances.findDoc(props.selectedOpportunityInstanceID);
    opportunityID = instance.opportunityID;
  }
  return (
    <div>
      <Button.Group attached="top">
        <Button>
          <InspectorCourseMenuContainer studentID={studentID} />
        </Button>
        <Button.Or />
        <Button>
          <InspectorOpportunityMenuContainer studentID={studentID} />
        </Button>
      </Button.Group>
      <Grid container>
        <Grid.Row stretched style={padddingBottomStyle}>
          {props.selectedCourseID ?
            <InspectorCourseViewContainer courseID={props.selectedCourseID} studentID={studentID} /> : ''}
          {props.selectedCourseInstanceID ? (
            <InspectorCourseViewContainer
              courseInstanceID={props.selectedCourseInstanceID}
              courseID={courseID}
              studentID={studentID}
            />
          ) : ''}
          {props.selectedOpportunityID ?
            <InspectorOpportunityViewContainer opportunityID={props.selectedOpportunityID} studentID={studentID} /> : ''}
          {props.selectedOpportunityInstanceID ? (
            <InspectorOpportunityViewContainer
              opportunityInstanceID={props.selectedOpportunityInstanceID}
              opportunityID={opportunityID}
              studentID={studentID}
            />
          ) : ''}
          {(!props.selectedCourseID && !props.selectedCourseInstanceID && !props.selectedOpportunityID && !props.selectedOpportunityInstanceID) ? 'Please choose a Course or Opportunity from the menus above or click on a Course or Opportunity in the Degree Experience Planner to the right.' : ''}
        </Grid.Row>
      </Grid>
    </div>
  );
};

const CourseOpportunityInspectorWidgetCon = withGlobalSubscription(CourseOpportunityInspectorWidget);
const CourseOpportunityInspectorWidgetCont = withInstanceSubscriptions(CourseOpportunityInspectorWidgetCon);
const COIW = withRouter(CourseOpportunityInspectorWidgetCont);
const CourseOpportunityInspectorWidgetConati = withTracker(() => ({
  courses: Courses.find({}, { sort: { shortName: 1 } }).fetch(),
  opportunities: Opportunities.find({}, { sort: { name: 1 } }).fetch(),
}))(COIW);
const CourseOpportunityInspectorWidgetContainer = connect(mapStateToProps)(CourseOpportunityInspectorWidgetConati);
export default CourseOpportunityInspectorWidgetContainer;
