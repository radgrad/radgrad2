import React from 'react';
import { Menu, Tab } from 'semantic-ui-react';
import { AdvisorManageStudentsProps } from '../../../pages/advisor/utilities/AdvisorManageStudentsProps';
import RadGradHeader from '../../shared/RadGradHeader';
import RadGradSegment from '../../shared/RadGradSegment';
import RadGradTabHeader from '../../shared/RadGradTabHeader';
import AdvisorUpdateStudentTab from './AdvisorUpdateStudentTab';


const AdvisorManageStudents: React.FC<AdvisorManageStudentsProps> = ({
  students,
  alumni,
  careerGoals,
  courses,
  interests,
  opportunities,
  profileCareerGoals,
  profileCourses,
  profileInterests,
  profileOpportunities,
}) => {
  const header = <RadGradHeader title='manage students' dividing icon='user graduate' />;
  const panes = [
    {
      menuItem: <Menu.Item key='update-tab'><RadGradTabHeader title='update' /></Menu.Item>,
      render: () => (
        <AdvisorUpdateStudentTab students={students} alumni={alumni} careerGoals={careerGoals} courses={courses}
                                 interests={interests} opportunities={opportunities}
                                 profileCareerGoals={profileCareerGoals}
                                 profileCourses={profileCourses} profileInterests={profileInterests}
                                 profileOpportunities={profileOpportunities} />),
    },
    {
      menuItem: <Menu.Item key='add-new-tab'><RadGradTabHeader title='add new' /></Menu.Item>,
      render: () => (<Tab.Pane>Add new</Tab.Pane>),
    },
    {
      menuItem: <Menu.Item key='other-tab'><RadGradTabHeader title='other' /></Menu.Item>,
      render: () => (<Tab.Pane>other</Tab.Pane>),
    },
  ];
  return (
    <RadGradSegment header={header}>
      <Tab panes={panes} />
    </RadGradSegment>
  );
};

export default AdvisorManageStudents;
