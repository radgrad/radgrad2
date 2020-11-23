import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { IAdvisorOrFacultyProfile, IStudentProfile } from '../../../typings/radgrad';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import RetrieveUserWidget from '../../components/admin/home/RetrieveUserWidget';
import FilterUserWidget from '../../components/admin/home/FilterUserWidget';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

export interface IFilterUsers {
  firstNameRegex?: string;
  lastNameRegex?: string;
  userNameRegex?: string;
}

interface IAdminHomePageProps {
  advisors: IAdvisorOrFacultyProfile[];
  faculty: IAdvisorOrFacultyProfile[];
  students: IStudentProfile[];
  alumni: IStudentProfile[];
}

const AdminHomePage = (props: IAdminHomePageProps) => {
  const [firstNameRegexState, setFirstNameRegex] = useState('');
  const [lastNameRegexState, setLastNameRegex] = useState('');
  const [usernameRegexState, setusernameRegex] = useState('');

  const updateFirstNameRegex = (firstNameRegex) => {
    setFirstNameRegex(firstNameRegex);
  };

  const updateLastNameRegex = (lastNameRegex) => {
    setLastNameRegex(lastNameRegex);
  };

  const updateUserNameRegex = (userNameRegex) => {
    setusernameRegex(userNameRegex);
  };

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  return (
    <div id="admin-home-page">
      <AdminPageMenuWidget />
      <Container textAlign="center" fluid={false}>
        <FilterUserWidget
          updateFirstNameRegex={updateFirstNameRegex}
          updateLastNameRegex={updateLastNameRegex}
          updateUserNameRegex={updateUserNameRegex}
        />
        <RetrieveUserWidget
          firstNameRegex={firstNameRegexState}
          lastNameRegex={lastNameRegexState}
          userNameRegex={usernameRegexState}
          advisors={props.advisors}
          faculty={props.faculty}
          alumni={props.alumni}
          students={props.students}
        />
      </Container>
    </div>
  );
};

const AdminHomePageContainer = withTracker(() => {
  const advisors = AdvisorProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const faculty = FacultyProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const students = StudentProfiles.find({ isAlumni: false }, { sort: { lastName: 1 } }).fetch();
  const alumni = StudentProfiles.find({ isAlumni: true }, { sort: { lastName: 1 } }).fetch();
  return {
    advisors,
    faculty,
    students,
    alumni,
  };
})(AdminHomePage);

export default AdminHomePageContainer;
