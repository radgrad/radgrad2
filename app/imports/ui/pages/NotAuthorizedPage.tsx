import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header } from 'semantic-ui-react';
import LandingNavBar from '../components/landing/LandingNavBar';

interface NotAuthorizedPageProps {
  role: string;
}

/** Render a not authorized page if the user enters a URL that they are not allowed to see. */
const NotAuthorizedPage: React.FC<NotAuthorizedPageProps> = ({ role }) => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  return (
    <div>
      <LandingNavBar currentUser={currentUser} instanceName={Meteor.settings.public.instanceName} role={role} />
      <Header as="h2" textAlign="center">
        <p>You are not authorized to view this page.</p>
      </Header>
    </div>
  );
};
export default NotAuthorizedPage;
