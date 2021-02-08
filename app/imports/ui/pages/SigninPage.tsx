import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { ROLE } from '../../api/role/Role';
import LandingNavBarContainer from '../components/landing/LandingNavBar';

/**
 * SigninPage page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
const SigninPage: React.FC = () => {
  const [emailState, setEmail] = useState('');
  const [passwordState, setPassword] = useState('');
  const [errorState, setError] = useState('');
  const [redirectToRefererState, setRedirectToReferer] = useState(false);
  const instanceName = Meteor.settings.public.instanceName;

  /** Update the form controls each time the user interacts with them. */
  const handleChange = (e, { name, value }) => {
    // console.log('handleChange', name, value);
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
      // do nothing
    }
  };

  /** Handle SigninPage submission using Meteor's account mechanism. */
  const handleSubmit = () => {
    Meteor.loginWithPassword(emailState, passwordState, (err) => {
      if (err) {
        setError(err.message);
      } else {
        setError('');
        setRedirectToReferer(true);
        localStorage.setItem('logoutEvent', 'false');
      }
    });
  };

  /** Render the signin form. */
  const username = emailState;
  const userId = Meteor.userId();
  let pathname = '';
  if (Roles.userIsInRole(userId, [ROLE.ADMIN])) {
    pathname = `/admin/${username}/home`;
  } else if (Roles.userIsInRole(userId, [ROLE.ADVISOR])) {
    pathname = `/advisor/${username}/home`;
  } else if (Roles.userIsInRole(userId, [ROLE.FACULTY])) {
    pathname = `/faculty/${username}/home`;
  } else if (Roles.userIsInRole(userId, [ROLE.STUDENT])) {
    pathname = `/student/${username}/home`;
  }
  const { from } = { from: { pathname } };
  // if correct authentication, redirect to page instead of login screen
  if (redirectToRefererState) {
    return <Redirect to={from} />;
  }
  const containerStyle = { marginTop: 15 };
  // Otherwise return the Login form.
  return (
    <div>
      {/* TODO get currentUser */}
      <LandingNavBarContainer currentUser="" instanceName={instanceName} />
      <Container id="signin-page" style={containerStyle}>
        <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center">
              Login to your account
            </Header>
            <Form onSubmit={handleSubmit}>
              <Segment stacked>
                <Form.Input label="Email" id="signin-form-email" icon="user" iconPosition="left" name="email" type="email" placeholder="E-mail address" onChange={handleChange} />
                <Form.Input label="Password" id="signin-form-password" icon="lock" iconPosition="left" name="password" placeholder="Password" type="password" onChange={handleChange} />
                <Form.Button id="signin-form-submit" content="Submit" />
              </Segment>
            </Form>
            {errorState === '' ? '' : <Message error header="Login was not successful" content={errorState} />}
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
};

export default SigninPage;
