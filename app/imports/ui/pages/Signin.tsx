import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { ROLE } from '../../api/role/Role';
import LandingNavBarContainer from '../components/landing/LandingNavBar';

interface ISigninProps {
  location: {
    state: {
      from: string;
    };
  };
}

interface ISigninState {
  email: string;
  password: string;
  error: string;
  redirectToReferer: boolean;
}

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
export default class Signin extends React.Component<ISigninProps, ISigninState> {

  /** Initialize component state with properties for login and redirection. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', redirectToReferer: false };
  }

  /** Update the form controls each time the user interacts with them. */
  public handleChange = (e) => {
    const change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  /** Handle Signin submission using Meteor's account mechanism. */
  public handleSubmit = () => {
    const { email, password } = this.state;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({ error: err.message });
      } else {
        this.setState({ error: '', redirectToReferer: true });
      }
    });
  };

  /** Render the signin form. */
  public render() {
    const username = this.state.email;
    const userId = Meteor.userId();
    let pathname = '';
    if (Roles.userIsInRole(userId, [ROLE.ADMIN])) {
      pathname = `/admin/${username}/home`;
    } else if (Roles.userIsInRole(userId, [ROLE.ADVISOR])) {
      pathname = `/advisor/${username}/home`;
    } else if (Roles.userIsInRole(userId, [ROLE.FACULTY])) {
      pathname = `/faculty/${username}/home`;
    } else if (Roles.userIsInRole(userId, [ROLE.MENTOR])) {
      pathname = `/mentor/${username}/home`;
    } else if (Roles.userIsInRole(userId, [ROLE.STUDENT])) {
      pathname = `/student/${username}/home`;
    }
    const { from } = { from: { pathname } };
    // console.log(this.state);
    // if correct authentication, redirect to page instead of login screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from} />;
    }
    const containerStyle = { marginTop: 15 };
    // Otherwise return the Login form.
    return (
      <div>
        <LandingNavBarContainer />
        <Container style={containerStyle}>
          <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
            <Grid.Column>
              <Header as="h2" textAlign="center">
                Login to your account
              </Header>
              <Form onSubmit={this.handleSubmit}>
                <Segment stacked>
                  <Form.Input
                    label="Email"
                    icon="user"
                    iconPosition="left"
                    name="email"
                    type="email"
                    placeholder="E-mail address"
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    label="Password"
                    icon="lock"
                    iconPosition="left"
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={this.handleChange}
                  />
                  <Form.Button content="Submit" />
                </Segment>
              </Form>
              <Message>
                <Link to="/signup">Click here to Register</Link>
              </Message>
              {this.state.error === '' ? (
                ''
              ) : (
                <Message
                  error
                  header="Login was not successful"
                  content={this.state.error}
                />
              )}
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}
