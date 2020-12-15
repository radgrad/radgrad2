import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Grid, Segment, Button, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import moment from 'moment';
import _ from 'lodash';
import { Users } from '../../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../../api/degree-plan/AcademicYearInstanceCollection';
import AcademicYearView from './AcademicYearView';
import {
  IAcademicYearInstance,
  IAcademicYearInstanceDefine, ICourseInstance,
  IMeteorError, IOpportunityInstance,
} from '../../../../typings/radgrad';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { defineMethod, removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { degreePlannerActions } from '../../../../redux/student/degree-planner';

interface IDePProps {
  selectCourseInstance: (courseInstanceID: string) => any;
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
  selectFavoriteDetailsTab: () => any;
  academicYearInstances: IAcademicYearInstance[];
  courseInstances: ICourseInstance[];
  opportunityInstances: IOpportunityInstance[];
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
  selectFavoriteDetailsTab: () => dispatch(degreePlannerActions.selectFavoriteDetailsTab()),
});

const DEPWidget: React.FC<IDePProps> = ({ selectCourseInstance, selectOpportunityInstance, selectFavoriteDetailsTab, academicYearInstances, courseInstances, opportunityInstances }) => {
  const { username } = useParams();
  const studentID = Users.getID(username);

  const generateAcademicYearInstances = (number) => {
    const student = username;
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

  let years: IAcademicYearInstance[] = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
  // Automatically generate 4 AcademicYearInstances if none exists
  if (years.length === 0) {
    generateAcademicYearInstances(4);
    years = academicYearInstances;
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
    selectCourseInstance(value);
    selectFavoriteDetailsTab();
  };

  const handleClickOpportunityInstance = (event, { value }) => {
    event.preventDefault();
    selectOpportunityInstance(value);
    selectFavoriteDetailsTab();
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

  const handleAddPrevYear = (event: any): void => {
    event.preventDefault();
    const student = username;
    const prevYear = yearsState[0].year - 1;
    const definitionData: IAcademicYearInstanceDefine = { year: prevYear, student };
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
        years = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
        setYears(years);
        visibleYears = yearsState.slice(visibleStartIndexState, visibleStartIndexState + 5);
        setVisibleYears(visibleYears);
      }
    });
  };

  const handleAddYear = (event: any): void => {
    event.preventDefault();
    const student = username;
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
        years = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
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
        years = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
        setYears(years);
        visibleStartIndex = visibleStartIndexState - 1;
        setVisibleStartIndex(visibleStartIndex);
        visibleYears = yearsState.slice(visibleStartIndex, visibleStartIndex + 4);
        setVisibleYears(visibleYears);
      }
    });
  };

  const isTermEmpty = (termID: string): boolean => {
    const courseInstancesFiltered = CourseInstances.findNonRetired({
      termID: termID,
      studentID: studentID,
    });
    const opportunityInstancesFiltered = OpportunityInstances.findNonRetired({
      termID: termID,
      studentID: studentID,
    });
    return courseInstancesFiltered.length === 0 && opportunityInstancesFiltered.length === 0;
  };

  const isYearEmpty = (year): boolean => {
    const mapped = year.termIDs.map((termID) => isTermEmpty(termID));
    return mapped.every(bool => bool === true);
  };

  return (
    <Segment padded id="studentDepWidget">
      <Grid stackable columns="equal">
        <Grid.Row stretched>
          {_.map(visibleYearsState, (year) => (
            <AcademicYearView
              key={year._id}
              academicYear={year}
              studentID={studentID}
              handleClickCourseInstance={handleClickCourseInstance}
              handleClickOpportunityInstance={handleClickOpportunityInstance}
              courseInstances={courseInstances}
              opportunityInstances={opportunityInstances}
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
            ) : (
              <Button color="green" onClick={handleAddPrevYear}>
                <Icon name="plus circle" /> Add Previous Academic Year
              </Button>
            )}
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

export default connect(null, mapDispatchToProps)(DEPWidget);
