import React, { useEffect, useState } from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
// import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { getLastAcademicTermMethod } from '../../../../api/user/StudentProfileCollection.methods';
import { getWhatsNew } from '../../../../api/whats-new/WhatsNew.methods';
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
  const startTerm = AcademicTerms.findDoc({ termNumber: 0 });
  const [lastTerm, setLastTerm] = useState(startTerm);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    // console.log('check for infinite loop');
    const fetchData = () => {
      getLastAcademicTermMethod.callPromise(student.username)
        .then(result => setLastTerm(result));
    };
    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched]);

  // const updatedOn = student.updatedAt ? student.updatedAt : student.createdAt;
  // const updatedOnStr = `Updated on ${moment(updatedOn).format('MM/DD/YYYY')}`;

  return (
    <Grid.Row>
      <Grid.Column width={3}>
        {student.retired ? <Icon name='eye slash'/> : ''}
        {name}
      </Grid.Column>
      <Grid.Column width={2}>
        <EditStudentButton student={student} careerGoals={careerGoals} courses={courses} interests={interests}
          opportunities={opportunities} profileCareerGoals={profileCareerGoals}
          profileInterests={profileInterests} />
      </Grid.Column>
      <Grid.Column width={2} />
      <Grid.Column width={3}>
        <ButtonLink url={`/${student.isAlumni ? 'alumni' : 'student'}/${student.username}/home`} label='student view'
          size='mini' />
      </Grid.Column>
      <Grid.Column width={3}>
        {/* updatedOnStr */}
        {lastTerm ? AcademicTerms.toString(lastTerm._id) : ''}
      </Grid.Column>
      <Grid.Column width={2}>
        <RadGradMenuLevel level={student.level} />
      </Grid.Column>
    </Grid.Row>
  );
};

export default ManageStudentItem;
