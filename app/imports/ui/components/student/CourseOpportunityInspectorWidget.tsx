import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { ICourse, ICourseInstance, IOpportunity, IOpportunityInstance } from '../../../typings/radgrad';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';

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

const mapStateToProps = (state) => {
  return {
    selectedCourseID: state.selectedCourseID,
    selectedCourseInstanceID: state.selectedCourseInstanceID,
    selectedOpportunityID: state.selectedOpportunityID,
    selectedOpportunityInstanceID: state.selectedOpportunityInstanceID,
  };
};

class CourseOpportunityInspectorWidget extends React.Component<ICOInspectorWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    console.log(this.props);
    const userName = this.props.match.params.username;
    const studentID = Users.getID(userName);
    const courseInstances = CourseInstances.find({ studentID }).fetch();
    const opportunityInstances = OpportunityInstances.find({ studentID }).fetch();
    console.log(courseInstances, opportunityInstances);
    return (
      <div>
        <Button.Group>
          <Button>
            <Dropdown text="Courses">
              <Dropdown.Menu>
                <Dropdown.Item>Academic Plans</Dropdown.Item>
                <Dropdown.Item>Career Goals</Dropdown.Item>
                <Dropdown.Item>Courses</Dropdown.Item>
                <Dropdown.Item>Degrees</Dropdown.Item>
                <Dropdown.Item>Interests</Dropdown.Item>
                <Dropdown.Item>Opportunities</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Button>
          <Button.Or/>
          <Button>Opportunities</Button>
        </Button.Group>
        <br/>
        Selected Course ID: {this.props.selectedCourseID}<br/>
        Selected Course Instance ID: {this.props.selectedCourseInstanceID}<br/>
        Selected Opportunity ID: {this.props.selectedOpportunityID}<br/>
        Selected Opportunity Instance ID: {this.props.selectedOpportunityInstanceID}
      </div>
    );
  }
}

const CourseOpportunityInspectorWidgetCon = withGlobalSubscription(CourseOpportunityInspectorWidget);
const CourseOpportunityInspectorWidgetCont = withInstanceSubscriptions(CourseOpportunityInspectorWidgetCon);
const COIW = withRouter(CourseOpportunityInspectorWidgetCont);
const CourseOpportunityInspectorWidgetConati = withTracker((props) => {
  return {
    courses: Courses.findNonRetired({}, { sort: { shortName: 1 } }),
    opportunities: Opportunities.findNonRetired({}, { sort: { name: 1 } }),
  };
})(COIW);
const CourseOpportunityInspectorWidgetContainer = connect(mapStateToProps)(CourseOpportunityInspectorWidgetConati);
export default CourseOpportunityInspectorWidgetContainer;
