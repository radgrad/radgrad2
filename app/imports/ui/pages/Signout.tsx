import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Header } from 'semantic-ui-react';
import LandingNavBarContainer from '../components/landing/LandingNavBar';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
const Signout = () => {
  Meteor.logout(function callback(error) {
    if (error) {
      console.error('Error logging out ', error);
    } else {
      localStorage.setItem('logoutEvent', 'true');
    }
  });
  return (
    <div id="signout-page">
      <LandingNavBarContainer />
      <Header as="h2" textAlign="center">
        <p>You are signed out.</p>
      </Header>
    </div>
  );
};

export default Signout;
