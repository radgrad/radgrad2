import React from 'react';
import { Grid } from 'semantic-ui-react';
import moment from 'moment';
import { ButtonLink } from '../../shared/button/ButtonLink';
import RadGradMenuLevel from '../../shared/RadGradMenuLevel';
import EditStudentButton from './EditStudentButton';
import { ManageStudentProps } from './ManageStudentProps';


const ManageStudentItem: React.FC<ManageStudentProps> = ({
  student,
  careerGoals,
  courses,
  interests,
  opportunities,
  profileCareerGoals, // These are the ones for the student
  profileInterests,
}) => {
  const name = `${student.lastName}, ${student.firstName}`;
  const updatedOn = student.updatedAt ? student.updatedAt : student.createdAt;
  const updatedOnStr = `Updated on ${moment(updatedOn).format('MM/DD/YYYY')}`;
  return (
    <Grid.Row>
      <Grid.Column width={3}>
        {name}
      </Grid.Column>
      <Grid.Column width={2}>
        <EditStudentButton student={student} careerGoals={careerGoals} courses={courses} interests={interests}
                           opportunities={opportunities} profileCareerGoals={profileCareerGoals}
                           profileInterests={profileInterests} />
      </Grid.Column>
      <Grid.Column width={3}>
        <ButtonLink url={`/${student.isAlumni ? 'alumni' : 'student'}/${student.username}/home`} label='student view'
                    size='mini' />
      </Grid.Column>
      <Grid.Column width={2} />
      <Grid.Column width={3}>
        {updatedOnStr}
      </Grid.Column>
      <Grid.Column width={2}>
        <RadGradMenuLevel level={student.level} />
      </Grid.Column>
    </Grid.Row>
  );
};

export default ManageStudentItem;
