import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Header } from 'semantic-ui-react';
import LandingNavBar from '../components/landing/LandingNavBar';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const NotFoundPage: React.FC = () => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  return (
    <div>
      <LandingNavBar currentUser={currentUser} instanceName={Meteor.settings.public.instanceName} />
      <Header as="h2" textAlign="center">
        <p>Page not found</p>
      </Header>
    </div>
  );
};

export default NotFoundPage;
