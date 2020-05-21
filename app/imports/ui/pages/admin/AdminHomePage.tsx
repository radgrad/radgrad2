import React, { useState } from 'react';
import { Container, Button } from 'semantic-ui-react';
import * as _ from 'lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import RetrieveUserWidget from '../../components/admin/RetrieveUserWidget';
import FilterUserWidget from '../../components/shared/FilterUserWidget';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { pageInterestFindMethod } from '../../../api/page-tracking/PageInterestCollection.methods';

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

  // TODO: remove after done with issue-138
  const handleClick = (e) => {
    e.preventDefault();
    userInteractionFindMethod.call({}, (error, result) => {
      const userInteractions = _.groupBy(result, 'username');
      console.log('userInteractions %o', userInteractions);
    });
    pageInterestFindMethod.call({}, (error, result) => {
      const pageInterests = _.groupBy(result, 'username');
      console.log('pageInterests %o', pageInterests);
    });
  };

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */

  return (
    <div>
      <AdminPageMenuWidget />
      <Container textAlign="center" fluid={false}>
        {/* TODO: remove after done with issue-158 */}
        <Button onClick={handleClick}>User Interactions</Button>
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
