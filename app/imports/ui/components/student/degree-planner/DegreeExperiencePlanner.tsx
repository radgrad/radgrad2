import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Segment } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { Users } from '../../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../../api/degree-plan/AcademicYearInstanceCollection';
import { ButtonAction } from '../../shared/button/ButtonAction';
import AcademicYearView from './AcademicYearView';
import {
  AcademicYearInstance,
  AcademicYearInstanceDefine,
  CourseInstance,
  OpportunityInstance, VerificationRequest,
} from '../../../../typings/radgrad';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { defineMethod, removeItMethod } from '../../../../api/base/BaseCollection.methods';

interface DePProps {
  academicYearInstances: AcademicYearInstance[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  verificationRequests: VerificationRequest[];
  // internshipInstances: InternshipInstance[];
}

const DegreeExperiencePlanner: React.FC<DePProps> = ({ academicYearInstances, courseInstances, opportunityInstances, verificationRequests /* , internshipInstances */ }) => {
  const { username } = useParams();
  const studentID = Users.getID(username);

  const generateAcademicYearInstances = (number) => {
    const student = username;
    let currentYear = moment().year();
    _.times(number, () => {
      const definitionData: AcademicYearInstanceDefine = { year: currentYear++, student };
      const collectionName = AcademicYearInstances.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData })
        .catch((error) => console.error(`Error creating 4 automatically generated AcademicYearInstances from Degree Planner: ${error.message}`));
    });
  };

  let years: AcademicYearInstance[] = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
  // Automatically generate 4 AcademicYearInstances if none exists
  if (years.length === 0) {
    generateAcademicYearInstances(4);
    years = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
  }
  let visibleYears = years;

  const handleAddYear = (): void => {
    const student = username;
    const numYears = visibleYears.length;
    const nextYear = visibleYears[numYears - 1].year + 1;
    const definitionData: AcademicYearInstanceDefine = { year: nextYear, student };
    const collectionName = AcademicYearInstances.getCollectionName();
    defineMethod.callPromise({ collectionName, definitionData })
      .then(() => {
        RadGradAlert.success('Added new Academic Year', `Fall ${definitionData.year} - Summer ${definitionData.year + 1}`);
        years = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
        visibleYears = years;
      })
      .catch((error) => {
        RadGradAlert.failure('Failed to add a new Academic Year', error.message, error);
      });
  };


  const handleDeleteYear = (): void => {
    const collectionName = AcademicYearInstances.getCollectionName();
    const instance = visibleYears[visibleYears.length - 1]._id;
    removeItMethod.callPromise({ collectionName, instance })
      .then(() => {
        RadGradAlert.success('Deleted Academic Year', 'Successfully deleted an empty Academic Year');
        years = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
        visibleYears = years;
      })
      .catch((error) => { RadGradAlert.failure('Failed to delete Academic Year', error.message, error);});
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
    if (_.isNil(year)) {
      return false;
    }
    const mapped = year.termIDs.map((termID) => isTermEmpty(termID));
    return mapped.every((bool) => bool === true);
  };

  return (
    <Segment padded id="studentDepWidget">
      <Grid stackable columns="equal">
        {visibleYears.map((year) => (
          <AcademicYearView
            key={year._id}
            academicYear={year}
            studentID={studentID}
            courseInstances={courseInstances}
            opportunityInstances={opportunityInstances}
            verificationRequests={verificationRequests}
            // internshipInstances={internshipInstances}
          />
        ))}
        <Grid.Row textAlign="center">
          <Grid.Column textAlign="left">
            <ButtonAction onClick={handleAddYear} label='Add Year' icon='plus circle' id='add-year'/>
          </Grid.Column>
          <Grid.Column textAlign="center" />
          <Grid.Column textAlign="right">
            {isYearEmpty(visibleYears[visibleYears.length - 1]) &&
            (
              <ButtonAction onClick={handleDeleteYear} label='Delete Year' icon='minus circle' color='green' id='delete-year' />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default DegreeExperiencePlanner;
