import React, { useState } from 'react';
import { Tab } from 'semantic-ui-react';
import { AdvisorManageStudentsProps } from '../../../pages/advisor/utilities/AdvisorManageStudentsProps';
import AdvisorFilteredStudentTabs from './AdvisorFilteredStudentTabs';
import AdvisorFilterStudents from './AdvisorFilterStudents';

const AdvisorUpdateStudentTab: React.FC<AdvisorManageStudentsProps> = ({
  students,
  alumni,
  careerGoals,
  courses,
  interests,
  opportunities,
  profileCareerGoals,
  profileInterests,
}) => {
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [userNameFilter, setUserNameFilter] = useState('');

  const filterFirst = students.filter((s) => s.firstName.toLowerCase().includes(firstNameFilter.toLowerCase()));
  const filterLast = filterFirst.filter((s) => s.lastName.toLowerCase().includes(lastNameFilter.toLowerCase()));
  const filteredStudents = filterLast.filter((s) => s.username.toLowerCase().includes(userNameFilter.toLowerCase()));

  const filterAlumiFirst = alumni.filter((s) => s.firstName.toLowerCase().includes(firstNameFilter.toLowerCase()));
  const filterAlumniLast = filterAlumiFirst.filter((s) => s.lastName.toLowerCase().includes(lastNameFilter.toLowerCase()));
  const filteredAlumni = filterAlumniLast.filter((s) => s.username.toLowerCase().includes(userNameFilter.toLowerCase()));

  const numShowing = filteredStudents.length + filteredAlumni.length;
  return (
    <Tab.Pane>
      <AdvisorFilterStudents firstName={firstNameFilter} setFirstName={setFirstNameFilter} lastName={lastNameFilter}
        setLastName={setLastNameFilter} username={userNameFilter} setUserName={setUserNameFilter}
        numStudents={numShowing} />
      <AdvisorFilteredStudentTabs students={filteredStudents} alumni={filteredAlumni} careerGoals={careerGoals}
        courses={courses}
        interests={interests} opportunities={opportunities} profileCareerGoals={profileCareerGoals}
        profileInterests={profileInterests} />
    </Tab.Pane>
  );
};

export default AdvisorUpdateStudentTab;
