import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Header } from 'semantic-ui-react';
import LandingNavBarContainer from '../components/landing/LandingNavBar';

/** After the user clicks the "SignoutPage" link in the NavBar, log them out and display this page. */
const SignoutDidntAgreeToTermsPage: React.FC = () => {
  Meteor.logout((error) => {
    if (error) {
      console.error('Error logging out ', error);
    } else {
      localStorage.setItem('logoutEvent', 'true');
    }
  });
  const instanceName = Meteor.settings.public.instanceName;
  return (
    <div id="signout-page">
      <LandingNavBarContainer currentUser={undefined} instanceName={instanceName} />
      <Header as="h2" textAlign="center">
        <p>Since you didn&apos;t approve the terms and conditions, we signed you out.</p>
        <p>We will remove your information shortly.</p>
      </Header>
    </div>
  );
};

export default SignoutDidntAgreeToTermsPage;
