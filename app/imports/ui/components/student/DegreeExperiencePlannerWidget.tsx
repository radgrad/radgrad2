import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Grid, Segment, Button, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { selectCourseInstance, selectOpportunityInstance, selectInspectorTab } from '../../../redux/actions/actions';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import AcademicYearView from './AcademicYearView';
import { IAcademicYear, IAcademicYearDefine, ICourseInstance, IOpportunityInstance } from '../../../typings/radgrad'; // eslint-disable-line
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';

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

// FIXME: Figure out a way so we dont have to do "{[key: string]: any}". This is mainly have to do with the handleDeleteYear.
//        Can't call ._id on an AcademicYear type
interface IDePState {
  visibleYears: IAcademicYear[] | { [key: string]: any };
  visibleStartIndex: number;
  years: IAcademicYear[] | { [key: string]: any };
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
    const years = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
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

  public handleAddYear = (event: any): void => {
    event.preventDefault();
    const student = this.props.match.params.username;
    const numYears = this.state.years.length;
    const nextYear = this.state.years[numYears - 1].year + 1;
    const definitionData: IAcademicYearDefine = { year: nextYear, student };
    const collectionName = AcademicYearInstances.getCollectionName();
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Failed to create Academic Year',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Academic Year Created',
          type: 'success',
          text: 'Successfully created a new Academic Year',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    });
    const studentID = Users.getID(student);
    const years = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    const visibleStartIndex = this.state.visibleStartIndex - 1;
    const visibleYears = this.state.years.slice(visibleStartIndex, visibleStartIndex + 5);
    this.setState({
      years,
      visibleYears,
    });
  }

  public handleDeleteYear = (event: any): void => {
    event.preventDefault();
    const collectionName = AcademicYearInstances.getCollectionName();
    const instance = this.state.visibleYears[this.state.visibleYears.length - 1]._id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Failed to delete Academic Year',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Academic Year Deleted',
          type: 'success',
          text: 'Successfully deleted an empty Academic Year',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    });

    const student = this.props.match.params.username;
    const studentID = Users.getID(student);
    const years = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    const visibleYears = this.state.years.slice(this.state.visibleStartIndex, this.state.visibleStartIndex + 5);
    this.setState({
      years,
      visibleYears,
    });
  }

  public isTermEmpty = (termID: string): boolean => {
    const username = this.props.match.params.username;
    const studentID = Users.getID(username);
    const courseInstances = CourseInstances.findNonRetired({
      termID: termID,
      studentID: studentID,
    });
    const opportunityInstances = OpportunityInstances.findNonRetired({
      termID: termID,
      studentID: studentID,
    });
    return courseInstances.length === 0 && opportunityInstances.length === 0;
  }

  public isYearEmpty = (year: IAcademicYear): boolean => {
    const mapped = year.termIDs.map((termID) => this.isTermEmpty(termID));
    return mapped.every(bool => bool === true);
  }

  public render() {
    const { visibleYears, visibleStartIndex, years } = this.state;
    const username = this.props.match.params.username;
    const studentID = Users.getID(username);
    return (
      <Segment padded={true}>
        <Grid stackable={true} columns="equal">
          <Grid.Row stretched={true}>
            {_.map(visibleYears, (year) => (
              <AcademicYearView key={year._id} academicYear={year} studentID={studentID}
                                handleClickCourseInstance={this.handleClickCourseInstance}
                                handleClickOpportunityInstance={this.handleClickOpportunityInstance}/>
            ))}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>{visibleStartIndex > 0 ?
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
            <Grid.Column>
              {this.isYearEmpty(years[years.length - 1]) ?
                <Button color="green" icon={true} labelPosition="right" onClick={this.handleDeleteYear}>
                  <Icon name="minus circle"/> Delete Year
                </Button>
                :
                (visibleStartIndex < years.length - 4 &&
                  (<Button color="green" icon={true} labelPosition="right" onClick={this.handleClickNextYear}>
                    <Icon name="arrow circle right"/>
                    Next Year
                  </Button>))
              }
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
