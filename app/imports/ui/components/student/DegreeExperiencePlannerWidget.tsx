import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Segment, Button, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import moment from 'moment';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import AcademicYearView from './AcademicYearView';
import {
  IAcademicYearInstance,
  IAcademicYearInstanceDefine,
  ICourseInstance,
  IMeteorError, IOpportunityInstance,
} from '../../../typings/radgrad';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import { studentDepWidget } from './student-widget-names';
import { getUserIdFromRoute } from '../shared/RouterHelperFunctions';

interface IDePProps {
  selectCourseInstance: (courseInstanceID: string) => any;
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
  selectFavoriteDetailsTab: () => any;
  courseInstances: ICourseInstance[];
  opportunityInstances: IOpportunityInstance[];
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
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
  selectFavoriteDetailsTab: () => dispatch(degreePlannerActions.selectFavoriteDetailsTab()),
});

const DEPWidget = (props: IDePProps) => {
  const username = props.match.params.username;
  const studentID = Users.getID(username);

  const generateAcademicYearInstances = (number) => {
    const student = props.match.params.username;
    let currentYear = moment().year();
    _.times(number, () => {
      const definitionData: IAcademicYearInstanceDefine = { year: currentYear++, student };
      const collectionName = AcademicYearInstances.getCollectionName();
      defineMethod.call({ collectionName, definitionData }, (error: IMeteorError) => {
        if (error) {
          console.error(`Error creating 4 automatically generated AcademicYearInstances from Degree Planner: ${error.message}`);
        }
      });
    });
  };

  let years: IAcademicYearInstance[] = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
  // Automatically generate 4 AcademicYearInstances if none exists
  if (years.length === 0) {
    generateAcademicYearInstances(4);
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
  const [yearsState, setYears] = useState(years);
  const [visibleStartIndexState, setVisibleStartIndex] = useState(visibleStartIndex);
  const [visibleYearsState, setVisibleYears] = useState(visibleYears);

  const handleClickCourseInstance = (event, { value }) => {
    event.preventDefault();
    props.selectCourseInstance(value);
    props.selectFavoriteDetailsTab();
  };

  const handleClickOpportunityInstance = (event, { value }) => {
    event.preventDefault();
    props.selectOpportunityInstance(value);
    props.selectFavoriteDetailsTab();
  };

  const handleClickPrevYear = (event) => {
    event.preventDefault();
    visibleStartIndex = visibleStartIndexState - 1;
    visibleYears = yearsState.slice(visibleStartIndex, visibleStartIndex + 4);
    setVisibleStartIndex(visibleStartIndex);
    setVisibleYears(visibleYears);
  };

  const handleClickNextYear = (event) => {
    event.preventDefault();
    visibleStartIndex = visibleStartIndexState + 1;
    visibleYears = yearsState.slice(visibleStartIndex, visibleStartIndex + 4);
    setVisibleStartIndex(visibleStartIndex);
    setVisibleYears(visibleYears);
  };

  const handleAddYear = (event: any): void => {
    event.preventDefault();
    const student = props.match.params.username;
    const numYears = yearsState.length;
    const nextYear = yearsState[numYears - 1].year + 1;
    const definitionData: IAcademicYearInstanceDefine = { year: nextYear, student };
    const collectionName = AcademicYearInstances.getCollectionName();
    defineMethod.call({ collectionName, definitionData }, (error: IMeteorError) => {
      if (error) {
        Swal.fire({
          title: 'Failed to add a new Academic Year',
          text: error.message,
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      } else {
        Swal.fire({
          title: 'Added new Academic Year',
          icon: 'success',
          text: `Fall ${definitionData.year} - Summer ${definitionData.year + 1}`,
          showConfirmButton: false,
          timer: 1500,
        });
        years = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
        setYears(years);
        visibleYears = yearsState.slice(visibleStartIndexState, visibleStartIndexState + 5);
        setVisibleYears(visibleYears);
      }
    });
  };

  const handleDeleteYear = (event: any): void => {
    event.preventDefault();
    const collectionName = AcademicYearInstances.getCollectionName();
    const instance = visibleYearsState[visibleYearsState.length - 1]._id;
    removeItMethod.call({ collectionName, instance }, (error: IMeteorError) => {
      if (error) {
        Swal.fire({
          title: 'Failed to delete Academic Year',
          text: error.message,
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      } else {
        Swal.fire({
          title: 'Deleted Academic Year',
          icon: 'success',
          text: 'Successfully deleted an empty Academic Year',
          showConfirmButton: false,
          timer: 1500,
        });
        years = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
        setYears(years);
        visibleStartIndex = visibleStartIndexState - 1;
        setVisibleStartIndex(visibleStartIndex);
        visibleYears = yearsState.slice(visibleStartIndex, visibleStartIndex + 4);
        setVisibleYears(visibleYears);
      }
    });
  };

  const isTermEmpty = (termID: string): boolean => {
    const courseInstances = CourseInstances.findNonRetired({
      termID: termID,
      studentID: studentID,
    });
    const opportunityInstances = OpportunityInstances.findNonRetired({
      termID: termID,
      studentID: studentID,
    });
    return courseInstances.length === 0 && opportunityInstances.length === 0;
  };

  const isYearEmpty = (year): boolean => {
    const mapped = year.termIDs.map((termID) => isTermEmpty(termID));
    return mapped.every(bool => bool === true);
  };

  return (
    <Segment padded id={studentDepWidget}>
      <Grid stackable columns="equal">
        <Grid.Row stretched>
          {_.map(visibleYearsState, (year) => (
            <AcademicYearView
              key={year._id}
              academicYear={year}
              studentID={studentID}
              handleClickCourseInstance={handleClickCourseInstance}
              handleClickOpportunityInstance={handleClickOpportunityInstance}
            />
          ))}
        </Grid.Row>
        <Grid.Row textAlign="center">
          <Grid.Column textAlign="left">
            {visibleStartIndexState > 0 ? (
              <Button color="green" icon labelPosition="left" onClick={handleClickPrevYear}>
                <Icon name="arrow circle left" />
                Previous Year
              </Button>
            ) : ''}
          </Grid.Column>
          <Grid.Column textAlign="center">
            {/* This makes the "Add Academic Year" button only appear if the last Academic Year column is visible */}
            {!(visibleStartIndexState < yearsState.length - 4) ?
              (
                <Button color="green" onClick={handleAddYear}>
                  <Icon name="plus circle" /> Add Academic Year
                </Button>
              )
              : ''}
          </Grid.Column>
          <Grid.Column textAlign="right">
            {yearsState.length > 0 ? (
              <React.Fragment>
                {visibleStartIndexState < yearsState.length - 4 ?
                  (
                    <Button color="green" icon labelPosition="right" onClick={handleClickNextYear}>
                      <Icon name="arrow circle right" />
                      Next Year
                    </Button>
                  )
                  :
                  (isYearEmpty(yearsState[yearsState.length - 1]) && visibleStartIndexState !== 0) && (
                    <Button color="green" icon labelPosition="right" onClick={handleDeleteYear}>
                      <Icon name="minus circle" />
                      Delete Year
                    </Button>
                  )}
              </React.Fragment>
            ) : ''}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

const DEPWidgetCon = withTracker(({ match }) => {
  const studentID = getUserIdFromRoute(match);
  const courseInstances: ICourseInstance[] = CourseInstances.find({ studentID }).fetch();
  const opportunityInstances: IOpportunityInstance[] = OpportunityInstances.find({ studentID }).fetch();
  return {
    courseInstances,
    opportunityInstances,
  };
})(DEPWidget);
const DEPWidgetContainer = withRouter(DEPWidgetCon);
const DegreeExperiencePlannerWidget = connect(null, mapDispatchToProps)(DEPWidgetContainer);

export default DegreeExperiencePlannerWidget;
