import React from 'react';
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
  AcademicYearInstance,
  AcademicYearInstanceDefine,
  CourseInstance,
  MeteorError,
  OpportunityInstance,
} from '../../../../typings/radgrad';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { defineMethod, removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { degreePlannerActions } from '../../../../redux/student/degree-planner';

interface DePProps {
  selectCourseInstance: (courseInstanceID: string) => any;
  selectOpportunityInstance: (opportunityInstanceID: string) => any;
  selectProfileDetailsTab: () => any;
  academicYearInstances: AcademicYearInstance[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
  selectOpportunityInstance: (opportunityInstanceID) => dispatch(degreePlannerActions.selectOpportunityInstance(opportunityInstanceID)),
  selectProfileDetailsTab: () => dispatch(degreePlannerActions.selectProfileDetailsTab()),
});

const DEPWidget: React.FC<DePProps> = ({
  selectCourseInstance,
  selectOpportunityInstance,
  selectProfileDetailsTab,
  academicYearInstances,
  courseInstances,
  opportunityInstances,
}) => {
  const { username } = useParams();
  const studentID = Users.getID(username);

  const generateAcademicYearInstances = (number) => {
    const student = username;
    let currentYear = moment().year();
    _.times(number, () => {
      const definitionData: AcademicYearInstanceDefine = { year: currentYear++, student };
      const collectionName = AcademicYearInstances.getCollectionName();
      defineMethod.call({ collectionName, definitionData }, (error: MeteorError) => {
        if (error) {
          console.error(`Error creating 4 automatically generated AcademicYearInstances from Degree Planner: ${error.message}`);
        }
      });
    });
  };

  let years: AcademicYearInstance[] = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
  // Automatically generate 4 AcademicYearInstances if none exists
  if (years.length === 0) {
    generateAcademicYearInstances(4);
    years = academicYearInstances;
  }
  let visibleYears = years;

  const handleClickCourseInstance = (event, { value }) => {
    event.preventDefault();
    selectCourseInstance(value);
    selectProfileDetailsTab();
  };

  const handleClickOpportunityInstance = (event, { value }) => {
    event.preventDefault();
    selectOpportunityInstance(value);
    selectProfileDetailsTab();
  };

  const handleAddYear = (event: any): void => {
    event.preventDefault();
    const student = username;
    const numYears = visibleYears.length;
    const nextYear = visibleYears[numYears - 1].year + 1;
    const definitionData: AcademicYearInstanceDefine = { year: nextYear, student };
    const collectionName = AcademicYearInstances.getCollectionName();
    defineMethod.call({ collectionName, definitionData }, (error: MeteorError) => {
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
        visibleYears = years;
      }
    });
  };


  const handleDeleteYear = (event: any): void => {
    event.preventDefault();
    const collectionName = AcademicYearInstances.getCollectionName();
    const instance = visibleYears[visibleYears.length - 1]._id;
    removeItMethod.call({ collectionName, instance }, (error: MeteorError) => {
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
        visibleYears = years;
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
    return mapped.every((bool) => bool === true);
  };

  return (
    <Segment padded id="studentDepWidget">
      <Grid stackable columns="equal">
        {_.map(visibleYears, (year) => (
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
        <Grid.Row textAlign="center">
          <Grid.Column textAlign="left" />
          <Grid.Column textAlign="center">
            {/* This makes the "Add Academic Year" button only appear if the last Academic Year column is visible */}
            <Button color="green" onClick={handleAddYear}>
              <Icon name="plus circle" /> Add Academic Year
            </Button>
          </Grid.Column>
          <Grid.Column textAlign="right">
            {isYearEmpty(visibleYears[visibleYears.length - 1]) &&
            (
              <Button color="green" icon labelPosition="right" onClick={handleDeleteYear}>
                <Icon name="minus circle" />
                Delete Year
              </Button>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default connect(null, mapDispatchToProps)(DEPWidget);
