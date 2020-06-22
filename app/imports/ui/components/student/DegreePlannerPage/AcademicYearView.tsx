import React from 'react';
import _ from 'lodash';
import { Grid } from 'semantic-ui-react';
import { IAcademicYearInstance } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import AcademicTermViewContainer from './AcademicTermView';

interface IAcademicYearViewProps {
  academicYear: IAcademicYearInstance;
  studentID: string;
  handleClickCourseInstance: (event, { value }) => any;
  handleClickOpportunityInstance: (event, { value }) => any;
}

const AcademicYearView = (props: IAcademicYearViewProps) => {
  const termIDs = props.academicYear.termIDs;
  const terms = _.map(termIDs, (id) => AcademicTerms.findDoc(id));
  return (
    <Grid.Column stretched>
      {_.map(terms, (term) => (
        <AcademicTermViewContainer
          key={term._id}
          term={term}
          studentID={props.studentID}
          handleClickCourseInstance={props.handleClickCourseInstance}
          handleClickOpportunityInstance={props.handleClickOpportunityInstance}
        />
      ))}
    </Grid.Column>
  );
};

export default AcademicYearView;
