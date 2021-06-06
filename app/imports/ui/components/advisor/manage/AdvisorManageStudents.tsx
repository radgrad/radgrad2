import React from 'react';
import { Menu, Tab } from 'semantic-ui-react';
import { AdvisorManageStudentsProps } from '../../../pages/advisor/utilities/AdvisorManageStudentsProps';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
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
      menuItem: <Menu.Item key={COMPONENTIDS.UPDATE_TAB} id={COMPONENTIDS.UPDATE_TAB}><RadGradTabHeader title='update' /></Menu.Item>,
      render: () => (
        <AdvisorUpdateStudentTab students={students} alumni={alumni} careerGoals={careerGoals} courses={courses}
          interests={interests} opportunities={opportunities}
          profileCareerGoals={profileCareerGoals}
          profileInterests={profileInterests} />),
    },
    {
      menuItem: <Menu.Item key={COMPONENTIDS.ADD_NEW_TAB} id={COMPONENTIDS.ADD_NEW_TAB}><RadGradTabHeader title='add new' /></Menu.Item>,
      render: () => (<AdvisorAddStudentTab careerGoals={careerGoals} interests={interests} />),
    },
    {
      menuItem: <Menu.Item key={COMPONENTIDS.OTHER_TAB} id={COMPONENTIDS.OTHER_TAB}><RadGradTabHeader title='other' /></Menu.Item>,
      render: () => (<AdvisorOtherTab />),
    },
    {
      menuItem: <Menu.Item key={COMPONENTIDS.MATRICULATE_TAB} id={COMPONENTIDS.MATRICULATE_TAB}><RadGradTabHeader title='matriculate students' /></Menu.Item>,
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
