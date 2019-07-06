import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Segment, Button, Icon } from 'semantic-ui-react';
import { selectCourseInstance, selectOpportunityInstance, selectInspectorTab } from '../../../redux/actions/actions';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import AcademicYearView from './AcademicYearView';
import { IAcademicYear } from '../../../typings/radgrad'; // eslint-disable-line

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

interface IDePState {
  visibleYears: IAcademicYear[];
  visibleStartIndex: number;
  years: IAcademicYear[];
}

const mapDispatchToProps = (dispatch) => ({
    selectCourseInstance: (courseInstanceID) => dispatch(selectCourseInstance(courseInstanceID)),
    selectOpportunityInstance: (opportunityInstanceID) => dispatch(selectOpportunityInstance(opportunityInstanceID)),
    selectInspectorTab: () => dispatch(selectInspectorTab()),
  });

class DEPWidget extends React.Component<IDePProps, IDePState> {

  constructor(props) {
    super(props);
    const username = props.match.params.username;
    const studentID = Users.getID(username);
    const years: IAcademicYear[] = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    console.log(years);
    let visibleYears;
    let visibleStartIndex = 0;
    if (years.length > 4) {
      visibleYears = years.slice(years.length - 4);
      visibleStartIndex = years.length - 4;
    } else {
      visibleYears = years;
    }
    this.state = {
      years,
      visibleStartIndex,
      visibleYears,
    };
  }

  public handleClickCourseInstance = (event, { value }) => {
    event.preventDefault();
    // console.log(`course instance id ${value}`);
    this.props.selectCourseInstance(value);
    this.props.selectInspectorTab();
  }

  public handleClickOpportunityInstance = (event, { value }) => {
    event.preventDefault();
    // console.log(`opportunity instance id ${value}`);
    this.props.selectOpportunityInstance(value);
    this.props.selectInspectorTab();
  }

  public handleClickPrevYear = (event) => {
    event.preventDefault();
    const visibleStartIndex = this.state.visibleStartIndex - 1;
    const visibleYears = this.state.years.slice(visibleStartIndex, visibleStartIndex + 5);
    this.setState({
      visibleStartIndex,
      visibleYears,
    });
  }

  public handleClickNextYear = (event) => {
    event.preventDefault();
    const visibleStartIndex = this.state.visibleStartIndex + 1;
    const visibleYears = this.state.years.slice(visibleStartIndex, visibleStartIndex + 5);
    this.setState({
      visibleStartIndex,
      visibleYears,
    });
  }

  public handleAddYear = (event) => {
    event.preventDefault();
    const student = this.props.match.params.username;
    const numYears = this.state.years.length;
    const nextYear = this.state.years[numYears - 1].year + 1;
    AcademicYearInstances.define({ year: nextYear, student });
    const studentID = Users.getID(student);
    const years: IAcademicYear[] = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    const visibleYears = this.state.years.slice(this.state.visibleStartIndex, this.state.visibleStartIndex + 5);
    this.setState({
      years,
      visibleYears,
    });
  }

  public render() {
    const username = this.props.match.params.username;
    const studentID = Users.getID(username);
    // console.log(this.state.visibleYears);
    return (
      <Segment padded={true}>
        <Grid stackable={true} columns="equal">
          <Grid.Row stretched={true}>
            {_.map(this.state.visibleYears, (year) => (
              <AcademicYearView key={year._id} academicYear={year} studentID={studentID}
                                handleClickCourseInstance={this.handleClickCourseInstance}
                                handleClickOpportunityInstance={this.handleClickOpportunityInstance}/>
            ))}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>{this.state.visibleStartIndex > 0 ?
              <Button color="green" icon={true} labelPosition="left" onClick={this.handleClickPrevYear}>
                <Icon name="arrow circle left"/>
                Prev Year
              </Button> : ''}
            </Grid.Column>
            <Grid.Column>
              <Button color="green" icon={true} labelPosition="left" onClick={this.handleAddYear}>
                <Icon name="plus circle"/> Add Academic Year
              </Button>
            </Grid.Column>
            <Grid.Column>{this.state.visibleStartIndex < this.state.years.length - 4 ?
              <Button color="green" icon={true} labelPosition="right" onClick={this.handleClickNextYear}>
                <Icon name="arrow circle right"/>
                Next Year
              </Button> : ''}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

const DEPWidgetContainer = withRouter(DEPWidget);
const DegreeExperiencePlannerWidget = connect(null, mapDispatchToProps)(DEPWidgetContainer);
export default DegreeExperiencePlannerWidget;
