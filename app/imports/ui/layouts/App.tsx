import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import '/public/semantic.min.css';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signout from '../pages/Signout';
import { ROLE } from '../../api/role/Role';
import { routes } from '../../startup/client/routes-config';

/** Top-level layout component for this application. Called in imports/startup/client/startup.tsx. */
class App extends React.Component {
  public render() {
    return (
      <Router>
        <Switch>
          {routes.LANDING.map((route, i) => (
            <Route exact={true} key={i} {...route} />
          ))}
          {routes.ADMIN.map((route, i) => (
            <AdminProtectedRoute key={i} {...route} />
          ))}
          {routes.ADVISOR.map((route, i) => (
            <AdvisorProtectedRoute key={i} {...route} />
          ))}
          {routes.FACULTY.map((route, i) => (
            <FacultyProtectedRoute key={i} {...route} />
          ))}
          {routes.MENTOR.map((route, i) => (
            <MentorProtectedRoute key={i} {...route} />
          ))}
          {routes.STUDENT.map((route, i) => (
            <StudentProtectedRoute key={i} {...route} />
          ))}
          <Route path="/signin" component={Signin}/>
          <ProtectedRoute path="/signout" component={Signout}/>
          <Route component={NotFound}/>
        </Switch>
      </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);
      return (isLogged && isAdmin) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

const AdvisorProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.ADVISOR]);
      return (isLogged && isAllowed) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

const FacultyProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.FACULTY]);
      return (isLogged && isAllowed) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

const MentorProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.MENTOR]);
      return (isLogged && isAllowed) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

const StudentProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
      return (isLogged && isAllowed) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

export default App;
