import React from 'react';
import _ from 'lodash';
import { Grid } from 'semantic-ui-react';
import { AcademicYearInstance, CourseInstance, OpportunityInstance } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import AcademicTermViewContainer from './AcademicTermView';

interface AcademicYearViewProps {
  academicYear: AcademicYearInstance;
  studentID: string;
  handleClickCourseInstance: (event, { value }) => any;
  handleClickOpportunityInstance: (event, { value }) => any;
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
}

const AcademicYearView: React.FC<AcademicYearViewProps> = ({ academicYear, studentID, handleClickCourseInstance,
  handleClickOpportunityInstance, courseInstances, opportunityInstances }) => {
  const termIDs = academicYear.termIDs;
  const terms = _.map(termIDs, (id) => AcademicTerms.findDoc(id));
  return (
    <Grid.Column stretched>
      {_.map(terms, (term) => (
        <AcademicTermViewContainer
          key={term._id}
          term={term}
          studentID={studentID}
          handleClickCourseInstance={handleClickCourseInstance}
          handleClickOpportunityInstance={handleClickOpportunityInstance}
          courseInstances={courseInstances}
          opportunityInstances={opportunityInstances}
        />
      ))}
    </Grid.Column>
  );
};

export default AcademicYearView;