import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Segment } from 'semantic-ui-react';
import { selectCourseInstance, selectOpportunityInstance, selectInspectorTab } from '../../../redux/actions/actions';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import AcademicYearView from './AcademicYearView';

interface IDePProps {
  selectCourseInstance: (courseInstanceID: string) => any;
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
  selectInspectorTab: () => any;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectCourseInstance: (courseInstanceID) => dispatch(selectCourseInstance(courseInstanceID)),
    selectOpportunityInstance: (opportunityInstanceID) => dispatch(selectOpportunityInstance(opportunityInstanceID)),
    selectInspectorTab: () => dispatch(selectInspectorTab()),
  };
};

class DEPWidget extends React.Component<IDePProps> {

  constructor(props) {
    super(props);
    this.handleClickCourseInstance = this.handleClickCourseInstance.bind(this);
    this.handleClickOpportunityInstance = this.handleClickOpportunityInstance.bind(this);
  }

  public handleClickCourseInstance(event, { value }) {
    event.preventDefault();
    // console.log(`course instance id ${value}`);
    this.props.selectCourseInstance(value);
    this.props.selectInspectorTab();
  }

  public handleClickOpportunityInstance(event, { value }) {
    event.preventDefault();
    // console.log(`opportunity instance id ${value}`);
    this.props.selectOpportunityInstance(value);
    this.props.selectInspectorTab();
  }

  public render() {
    const username = this.props.match.params.username;
    const studentID = Users.getID(username);
    const years = AcademicYearInstances.find({ studentID }).fetch();
    // console.log(years);
    return (
      <Segment padded={true}>
        <Grid stackable={true} columns="equal">
          <Grid.Row stretched={true}>
            {_.map(years, (year) => (
              <AcademicYearView key={year._id} academicYear={year} studentID={studentID}
                                handleClickCourseInstance={this.handleClickCourseInstance}
                                handleClickOpportunityInstance={this.handleClickOpportunityInstance}/>
            ))}
          </Grid.Row>
          {/*<Grid.Row>*/}
          {/*<BeautifulExample/>*/}
          {/*</Grid.Row>*/}
        </Grid>
      </Segment>
    );
  }
}

const DEPWidgetContainer = withRouter(DEPWidget);
const DegreeExperiencePlannerWidget = connect(null, mapDispatchToProps)(DEPWidgetContainer);
export default DegreeExperiencePlannerWidget;
