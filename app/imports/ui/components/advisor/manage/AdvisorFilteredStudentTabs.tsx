import React from 'react';
import { Grid, Menu, Tab } from 'semantic-ui-react';
import { AdvisorManageStudentsProps } from '../../../pages/advisor/utilities/AdvisorManageStudentsProps';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
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
      menuItem: <Menu.Item key={COMPONENTIDS.FILTERED_STUDENTS_TAB} id={COMPONENTIDS.FILTERED_STUDENTS_TAB}><RadGradTabHeader title='students' icon='user'
        count={students.length} /></Menu.Item>,
      render: () => (
        <Tab.Pane>
          <Grid id={COMPONENTIDS.FILTERED_STUDENTS_GRID} stackable>
            {students.map((s) => <ManageStudentItem student={s} key={s._id} careerGoals={careerGoals} courses={courses}
              interests={interests} opportunities={opportunities}
              profileCareerGoals={profileCareerGoals.filter((p) => p.userID === s.userID)}
              profileInterests={profileInterests.filter((p) => p.userID === s.userID)} />)}
          </Grid>
        </Tab.Pane>),
    },
    {
      menuItem: <Menu.Item key={COMPONENTIDS.FILTERED_ALUMNI_TAB} id={COMPONENTIDS.FILTERED_ALUMNI_TAB}><RadGradTabHeader title='alumni'
        icon='user graduate'
        count={alumni.length} /></Menu.Item>,
      render: () => (
        <Tab.Pane>
          <Grid id={COMPONENTIDS.FILTERED_ALUMNI_GRID} stackable>
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
