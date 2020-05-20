import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Segment, Button, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import moment from 'moment';
import _ from 'lodash';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import AcademicYearView from './AcademicYearView';
import { IAcademicYear, IAcademicYearDefine } from '../../../typings/radgrad';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { degreePlannerActions } from '../../../redux/student/degree-planner';
import { studentDepWidget } from './student-widget-names';

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

const DEPWidget = (props: IDePProps) => {
  const username = props.match.params.username;
  const studentID = Users.getID(username);

  const generateAcademicYearInstances = (number) => {
    const student = props.match.params.username;
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
  };

  let years = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
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
    // console.log('click course instance', value);
    props.selectCourseInstance(value);
    props.selectFavoriteDetailsTab();
  };

  const handleClickOpportunityInstance = (event, { value }) => {
    event.preventDefault();
    // console.log('click opportunity instance', value);
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
    const definitionData: IAcademicYearDefine = { year: nextYear, student };
    const collectionName = AcademicYearInstances.getCollectionName();
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Failed to create Academic Year',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Academic Year Created',
          icon: 'success',
          text: 'Successfully created a new Academic Year',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    });
    years = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    // eslint-disable-next-line react/no-access-state-in-setstate
    visibleYears = yearsState.slice(visibleStartIndexState, visibleStartIndexState + 5);
    setYears(years);
    setVisibleYears(visibleYears);
  };

  const handleDeleteYear = (event: any): void => {
    event.preventDefault();
    const collectionName = AcademicYearInstances.getCollectionName();
    const instance = visibleYearsState[visibleYearsState.length - 1]._id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Failed to delete Academic Year',
          text: `${error.message}. The page most likely didn't update properly fast enough. Refresh the page if you see this error.`,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Academic Year Deleted',
          icon: 'success',
          text: 'Successfully deleted an empty Academic Year',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      }
    });

    years = AcademicYearInstances.find({ studentID }, { sort: { year: 1 } }).fetch();
    visibleStartIndex = visibleStartIndexState - 1;
    visibleYears = yearsState.slice(visibleStartIndex, visibleStartIndex + 4);
    setYears(years);
    setVisibleYears(visibleYears);
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
            <Button color="green" onClick={handleAddYear}>
              <Icon name="plus circle" /> Add Academic Year
            </Button>
          </Grid.Column>
          <Grid.Column textAlign="right">
            {yearsState.length > 0 ? (
              <React.Fragment>
                {visibleStartIndexState < yearsState.length - 4 ? (
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

const DEPWidgetContainer = withRouter(DEPWidget);
const DegreeExperiencePlannerWidget = connect(null, mapDispatchToProps)(DEPWidgetContainer);
export default DegreeExperiencePlannerWidget;
