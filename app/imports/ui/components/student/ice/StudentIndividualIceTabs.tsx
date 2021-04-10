import React from 'react';
import { Label, Tab } from 'semantic-ui-react';
import { CourseInstance, Ice, ICEType, OpportunityInstance, ProfileInterest } from '../../../../typings/radgrad';

interface StudentIndividualIceTabsProps {
  type: ICEType;
  profileInterests: ProfileInterest[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
  projectedICE: Ice;
  earnedICE: Ice;
}

const StudentIndividualIceTabs: React.FC<StudentIndividualIceTabsProps> = ({ type, profileInterests, projectedICE, earnedICE, courseInstances, opportunityInstances }) => {
  const panes = [
    {
      menuItem: 'GET TO 100',
      render: () => <Label color='green'>100</Label>,
    },
    {
      menuItem: 'UNVERIFIED',
      render: () => <Label color='green'>UNVERIFIED</Label>,
    },
    {
      menuItem: 'VERIFIED',
      render: () => <Label color='green'>VERIFIED</Label>,
    },
  ];
  return <Tab panes={panes} />;
};

export default StudentIndividualIceTabs;
