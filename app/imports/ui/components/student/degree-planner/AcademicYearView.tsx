import React from 'react';
import { Grid } from 'semantic-ui-react';
import { AcademicYearInstance, CourseInstance, OpportunityInstance, VerificationRequest } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import AcademicTermView from './AcademicTermView';

interface AcademicYearViewProps {
  academicYear: AcademicYearInstance;
  studentID: string;
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  verificationRequests: VerificationRequest[];
  // internshipInstances: InternshipInstance[];
}

const AcademicYearView: React.FC<AcademicYearViewProps> = ({
  academicYear,
  studentID,
  courseInstances,
  opportunityInstances,
  verificationRequests,
  /* internshipInstances, */
}) => {
  const termIDs = academicYear.termIDs;
  const terms = termIDs.map((id) => AcademicTerms.findDoc(id));
  const smallPadding = {
    paddingTop: 2,
    paddingBottom: 2,
  };
  const smallLRPadding = {
    paddingLeft: 1,
    paddingRight: 1,
  };
  return (
    <Grid.Row columns="equal" key={academicYear._id} style={smallPadding}>
      {terms.map((term) => (
        <Grid.Column stretched key={term._id} style={smallLRPadding}>
          <AcademicTermView
            key={term._id}
            term={term}
            studentID={studentID}
            courseInstances={courseInstances}
            opportunityInstances={opportunityInstances}
            verificationRequests={verificationRequests}
            // internshipInstances={internshipInstances}
          />
        </Grid.Column>
      ))}
    </Grid.Row>
  );
};

export default AcademicYearView;
