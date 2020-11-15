import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import RetrieveUserWidget from '../../components/admin/home-page/RetrieveUserWidget';
import FilterUserWidget from '../../components/admin/home-page/FilterUserWidget';

export interface IFilterUsers {
  firstNameRegex?: string;
  lastNameRegex?: string;
  userNameRegex?: string;
}

const AdminHomePage = () => {
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
        />
      </Container>
    </div>
  );
};

export default AdminHomePage;
