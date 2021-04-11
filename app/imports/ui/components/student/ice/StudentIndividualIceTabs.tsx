import React from 'react';
import { Grid, Label, Tab } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { CourseInstance, Ice, ICEType, OpportunityInstance, ProfileInterest } from '../../../../typings/radgrad';
import StudentUnverifiedOpportunityItem from '../verification-requests/StudentUnverifiedOpportunityItem';
import StudentVerifiedOpportunityItem from '../verification-requests/StudentVerifiedOpportunityItem';

interface StudentIndividualIceTabsProps {
  type: ICEType;
  profileInterests: ProfileInterest[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  projectedICE: Ice;
  earnedICE: Ice;
}

const StudentIndividualIceTabs: React.FC<StudentIndividualIceTabsProps> = ({ type, profileInterests, projectedICE, earnedICE, courseInstances, opportunityInstances }) => {
  const verifiedCIs = courseInstances.filter((ci) => ci.verified);
  const unVerifiedCIs = courseInstances.filter((ci) => !ci.verified);
  const verifiedOIs = opportunityInstances.filter((oi) => oi.verified);
  let unVerifiedOIs = opportunityInstances.filter((oi) => !oi.verified);
  const currentAcademicTermNum = AcademicTerms.getCurrentAcademicTermDoc().termNumber;
  unVerifiedOIs = unVerifiedOIs.filter((oi) => AcademicTerms.findDoc(oi.termID).termNumber < currentAcademicTermNum);
  const panes = [
    {
      menuItem: 'GET TO 100',
      render: () => <Label color='green'>100</Label>,
    },
    {
      menuItem: 'UNVERIFIED',
      render: () => {
        switch (type) {
          case 'Innovation':
            return (<Grid stackable>
              {unVerifiedOIs.map((oi) => <StudentUnverifiedOpportunityItem opportunityInstance={oi} key={oi._id} />)}
            </Grid>);
          case 'Experience':
            return (<Grid stackable>
              {unVerifiedOIs.map((oi) => <StudentUnverifiedOpportunityItem opportunityInstance={oi} key={oi._id} />)}
            </Grid>);
        }
        return '';
      },
    },
    {
      menuItem: 'VERIFIED',
      render: () => (
          <Grid stackable>
            {verifiedOIs.map((oi) => <StudentVerifiedOpportunityItem opportunityInstance={oi} key={oi._id} />)}
          </Grid>),
    },
  ];
  return <Tab panes={panes} />;
};

export default StudentIndividualIceTabs;
