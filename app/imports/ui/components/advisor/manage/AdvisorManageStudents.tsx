import React from 'react';
import { Menu, Tab } from 'semantic-ui-react';
import { AdvisorManageStudentsProps } from '../../../pages/advisor/utilities/AdvisorManageStudentsProps';
import RadGradHeader from '../../shared/RadGradHeader';
import RadGradSegment from '../../shared/RadGradSegment';
import RadGradTabHeader from '../../shared/RadGradTabHeader';
import AdvisorAddStudentTab from './AdvisorAddStudentTab';
import AdvisorOtherTab from './AdvisorOtherTab';
import AdvisorUpdateStudentTab from './AdvisorUpdateStudentTab';
import MatriculateStudentsTab from './MatriculateStudentsTab';


const AdvisorManageStudents: React.FC<AdvisorManageStudentsProps> = ({
  students,
  alumni,
  careerGoals,
  courses,
  interests,
  opportunities,
  profileCareerGoals,
  profileInterests,
}) => {
  const header = <RadGradHeader title='manage students' dividing icon='user graduate' />;
  const panes = [
    {
      menuItem: <Menu.Item key='update-tab'><RadGradTabHeader title='update' /></Menu.Item>,
      render: () => (
        <AdvisorUpdateStudentTab students={students} alumni={alumni} careerGoals={careerGoals} courses={courses}
                                 interests={interests} opportunities={opportunities}
                                 profileCareerGoals={profileCareerGoals}
                                 profileInterests={profileInterests} />),
    },
    {
      menuItem: <Menu.Item key='add-new-tab'><RadGradTabHeader title='add new' /></Menu.Item>,
      render: () => (<AdvisorAddStudentTab careerGoals={careerGoals} interests={interests} />),
    },
    {
      menuItem: <Menu.Item key='other-tab'><RadGradTabHeader title='other' /></Menu.Item>,
      render: () => (<AdvisorOtherTab />),
    },
    {
      menuItem: <Menu.Item key='matriculate-tab'><RadGradTabHeader title='matriculate students' /></Menu.Item>,
      render: () => (<MatriculateStudentsTab students={students} alumni={alumni} />),
    },
  ];
  return (
    <RadGradSegment header={header}>
      <Tab panes={panes} />
    </RadGradSegment>
  );
};

export default AdvisorManageStudents;
