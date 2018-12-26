import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Segment } from 'semantic-ui-react';
import { selectCourseInstance, selectOpportunityInstance } from '../../../redux/actions/actions';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import AcademicYearView from './AcademicYearView';
import { createStore } from 'redux';
import rootReducer from '../../../redux/reducers';
import BeautifulExample from './BeautifulExample';

interface IDePProps {
  selectCourseInstance: (courseInstanceID: string) => any;
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
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
  };
};

class DEPWidget extends React.Component<IDePProps> {
  private store: any;

  constructor(props) {
    super(props);
    this.handleClickCourseInstance = this.handleClickCourseInstance.bind(this);
    this.handleClickOpportunityInstance = this.handleClickOpportunityInstance.bind(this);
    this.store = createStore(rootReducer);
  }

  public handleClickCourseInstance(event, { value }) {
    event.preventDefault();
    console.log(`course instance id ${value}`);
    this.props.selectCourseInstance(value);
  }

  public handleClickOpportunityInstance(event, { value }) {
    event.preventDefault();
    console.log(`opportunity instance id ${value}`);
    this.props.selectOpportunityInstance(value);
  }

  public render() {
    const username = this.props.match.params.username;
    const studentID = Users.getID(username);
    const years = AcademicYearInstances.find({ studentID }).fetch();
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
