import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ICourse, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
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

const mapStateToProps = (state) => ({
    selectedCourseID: state.depInspector.selectedCourseID,
    selectedCourseInstanceID: state.depInspector.selectedCourseInstanceID,
    selectedOpportunityID: state.depInspector.selectedOpportunityID,
    selectedOpportunityInstanceID: state.depInspector.selectedOpportunityInstanceID,
  });

class CourseOpportunityInspectorWidget extends React.Component<ICOInspectorWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const userName = this.props.match.params.username;
    const studentID = Users.getID(userName);
    const padddingBottomStyle = {
      paddingBottom: 0,
    };
    let courseID;
    if (this.props.selectedCourseInstanceID) {
      const courseInstance = CourseInstances.findDoc(this.props.selectedCourseInstanceID);
      courseID = courseInstance.courseID;
    }
    let opportunityID;
    if (this.props.selectedOpportunityInstanceID) {
      const instance = OpportunityInstances.findDoc(this.props.selectedOpportunityInstanceID);
      opportunityID = instance.opportunityID;
    }
    return (
      <div>
        <Button.Group attached="top">
          <Button>
            <InspectorCourseMenuContainer studentID={studentID}/>
          </Button>
          <Button.Or/>
          <Button>
            <InspectorOpportunityMenuContainer studentID={studentID}/>
          </Button>
        </Button.Group>
        <Grid container={true}>
          <Grid.Row stretched={true} style={padddingBottomStyle}>
            {this.props.selectedCourseID ?
              <InspectorCourseViewContainer courseID={this.props.selectedCourseID} studentID={studentID}/> : ''}
            {this.props.selectedCourseInstanceID ?
              <InspectorCourseViewContainer courseInstanceID={this.props.selectedCourseInstanceID} courseID={courseID}
                                   studentID={studentID}/> : ''}
            {this.props.selectedOpportunityID ?
              <InspectorOpportunityViewContainer opportunityID={this.props.selectedOpportunityID} studentID={studentID}/> : ''}
            {this.props.selectedOpportunityInstanceID ?
              <InspectorOpportunityViewContainer opportunityInstanceID={this.props.selectedOpportunityInstanceID}
                                        opportunityID={opportunityID} studentID={studentID}/> : ''}
            {(!this.props.selectedCourseID && !this.props.selectedCourseInstanceID && !this.props.selectedOpportunityID && !this.props.selectedOpportunityInstanceID) ? 'Please choose a Course or Opportunity from the menus above or click on a Course or Opportunity in the Degree Experience Planner to the right.' : ''}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const CourseOpportunityInspectorWidgetCon = withGlobalSubscription(CourseOpportunityInspectorWidget);
const CourseOpportunityInspectorWidgetCont = withInstanceSubscriptions(CourseOpportunityInspectorWidgetCon);
const COIW = withRouter(CourseOpportunityInspectorWidgetCont);
const CourseOpportunityInspectorWidgetConati = withTracker(() => ({
    courses: Courses.findNonRetired({}, { sort: { shortName: 1 } }),
    opportunities: Opportunities.findNonRetired({}, { sort: { name: 1 } }),
  }))(COIW);
const CourseOpportunityInspectorWidgetContainer = connect(mapStateToProps)(CourseOpportunityInspectorWidgetConati);
export default CourseOpportunityInspectorWidgetContainer;
