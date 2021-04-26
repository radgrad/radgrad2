import React from 'react';
import { Grid, Menu, Tab } from 'semantic-ui-react';
import { AdvisorManageStudentsProps } from '../../../pages/advisor/utilities/AdvisorManageStudentsProps';
import RadGradTabHeader from '../../shared/RadGradTabHeader';
import ManageStudentItem from './ManageStudentItem';

const AdvisorFilteredStudentTabs: React.FC<AdvisorManageStudentsProps> = ({
  students,
  alumni,
  careerGoals,
  courses,
  interests,
  opportunities,
  profileCareerGoals,
  profileInterests,
}) => {

  const panes = [
    {
      menuItem: <Menu.Item key='filtered-students-tab'><RadGradTabHeader title='students' icon='user' /></Menu.Item>,
      render: () => (
        <Tab.Pane>
          <Grid stackable>
            {students.map((s) => <ManageStudentItem student={s} key={s._id} careerGoals={careerGoals} courses={courses}
                                                    interests={interests} opportunities={opportunities}
                                                    profileCareerGoals={profileCareerGoals.filter((p) => p.userID === s.userID)}
                                                    profileInterests={profileInterests.filter((p) => p.userID === s.userID)} />)}
          </Grid>
        </Tab.Pane>),
    },
    {
      menuItem: <Menu.Item key='filtered-alumin-tab'><RadGradTabHeader title='alumni'
                                                                       icon='user graduate' /></Menu.Item>,
      render: () => (
        <Tab.Pane>
          <Grid stackable>
            {alumni.map((s) => <ManageStudentItem student={s} key={s._id} careerGoals={careerGoals} courses={courses}
                                                  interests={interests} opportunities={opportunities}
                                                  profileCareerGoals={profileCareerGoals.filter((p) => p.userID === s.userID)}
                                                  profileInterests={profileInterests.filter((p) => p.userID === s.userID)} />)}
          </Grid>
        </Tab.Pane>),
    },
  ];
  return (
    <Tab panes={panes} />
  );
};

export default AdvisorFilteredStudentTabs;
