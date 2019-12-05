import * as React from 'react';
import * as _ from 'lodash';
import { Grid } from 'semantic-ui-react';
import { IAcademicYear } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AcademicTermViewContainer from './AcademicTermView';

interface IAcademicYearViewProps {
  academicYear: IAcademicYear;
  studentID: string;
  handleClickCourseInstance: (event, { value }) => any;
  handleClickOpportunityInstance: (event, { value }) => any;
}

const AcademicYearView = (props: IAcademicYearViewProps) => {
  const termIDs = props.academicYear.termIDs;
  const terms = _.map(termIDs, (id) => AcademicTerms.findDoc(id));
  return (
    <Grid.Column stretched={true}>
      {_.map(terms, (term) => (
        <AcademicTermViewContainer key={term._id} term={term} studentID={props.studentID}
                                   handleClickCourseInstance={props.handleClickCourseInstance}
                                   handleClickOpportunityInstance={props.handleClickOpportunityInstance}/>
      ))}
    </Grid.Column>
  );
};

export default AcademicYearView;
