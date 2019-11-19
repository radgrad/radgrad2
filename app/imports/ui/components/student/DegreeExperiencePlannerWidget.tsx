import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Segment, Button, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { moment } from 'meteor/momentjs:moment';
import * as _ from 'lodash';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import AcademicYearView from './AcademicYearView';
import { IAcademicYear, IAcademicYearDefine, ICourseInstance, IOpportunityInstance } from '../../../typings/radgrad'; // eslint-disable-line
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { degreePlannerActions } from '../../../redux/student/degree-planner';

interface IDePProps {
  selectCourseInstance: (courseInstanceID: string) => any;
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
  selectFavoriteDetailsTab: () => any;
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
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
  selectFavoriteDetailsTab: () => dispatch(degreePlannerActions.selectFavoriteDetailsTab()),
});

class DEPWidget extends React.Component<IDePProps, IDePState> {
  constructor(props) {
    super(props);
    const username = props.match.params.username;
    const studentID = Users.getID(username);
    let years = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    // Automatically generate 4 AcademicYearInstances if none exists
    if (years.length === 0) {
      this.generateAcademicYearInstances(4);
      years = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    }
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

  public generateAcademicYearInstances = (number) => {
    const student = this.props.match.params.username;
    let currentYear = moment().year();
    _.times(number, () => {
      const definitionData: IAcademicYearDefine = { year: currentYear++, student };
      const collectionName = AcademicYearInstances.getCollectionName();
      defineMethod.call({ collectionName, definitionData }, (error) => {
        if (error) {
          console.error(`Error creating 4 automatically generated AcademicYearInstances from Degree Planner \n${error}`);
        }
      });
    });
  }

  public handleClickCourseInstance = (event, { value }) => {
    event.preventDefault();
    // console.log('click course instance', value);
    this.props.selectCourseInstance(value);
    this.props.selectFavoriteDetailsTab();
  }

  public handleClickOpportunityInstance = (event, { value }) => {
    event.preventDefault();
    // console.log('click opportunity instance', value);
    this.props.selectOpportunityInstance(value);
    this.props.selectFavoriteDetailsTab();
  }

  public handleClickPrevYear = (event) => {
    event.preventDefault();
    const visibleStartIndex = this.state.visibleStartIndex - 1;
    const visibleYears = this.state.years.slice(visibleStartIndex, visibleStartIndex + 4);
    this.setState({
      visibleStartIndex,
      visibleYears,
    });
  }

  public handleClickNextYear = (event) => {
    event.preventDefault();
    const visibleStartIndex = this.state.visibleStartIndex + 1;
    const visibleYears = this.state.years.slice(visibleStartIndex, visibleStartIndex + 4);
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
    const visibleYears = this.state.years.slice(this.state.visibleStartIndex, this.state.visibleStartIndex + 5);
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
          text: `${error.message}. The page most likely didn't update properly fast enough. Refresh the page if you see this error.`,
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
    const visibleStartIndex = this.state.visibleStartIndex - 1;
    const visibleYears = this.state.years.slice(visibleStartIndex, visibleStartIndex + 4);
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

  public isYearEmpty = (year): boolean => {
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
          <Grid.Row textAlign="center">
            <Grid.Column textAlign="left">
              {visibleStartIndex > 0 ?
                <Button color="green" icon={true} labelPosition="left" onClick={this.handleClickPrevYear}>
                  <Icon name="arrow circle left"/>Previous Year
                </Button> : ''}
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Button color="green" onClick={this.handleAddYear}>
                <Icon name="plus circle"/> Add Academic Year
              </Button>
            </Grid.Column>
            <Grid.Column textAlign="right">
              {years.length > 0 ?
                <React.Fragment>
                  {visibleStartIndex < years.length - 4 ?
                    <Button color="green" icon={true} labelPosition="right" onClick={this.handleClickNextYear}>
                      <Icon name="arrow circle right"/>Next Year
                    </Button>
                    :
                    (this.isYearEmpty(years[years.length - 1]) && visibleStartIndex !== 0) &&
                    <Button color="green" icon={true} labelPosition="right" onClick={this.handleDeleteYear}>
                      <Icon name="minus circle"/>Delete Year
                    </Button>}
                </React.Fragment> : ''}
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
