import React from 'react';
import { Header } from 'semantic-ui-react';
import LandingNavBarContainer from '../components/landing/LandingNavBar';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const NotAuthorizedPage = () => (
  <div>
    <LandingNavBarContainer />
    <Header as="h2" textAlign="center">
      <p>You are not authorized to view this page.</p>
    </Header>
  </div>
);

export default NotAuthorizedPage;
