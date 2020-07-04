import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import '/public/semantic.min.css';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signout from '../pages/Signout';
import { ROLE } from '../../api/role/Role';
import { routes } from '../../startup/client/routes-config';
import withGlobalSubscription from './shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from './shared/InstanceSubscriptionsHOC';
import {
  getUsername,
} from '../components/shared/RouterHelperFunctions';
import { Users } from '../../api/user/UserCollection';
import NotAuthorized from '../pages/NotAuthorized';
import withPageTracker from './PageTrackerHOC';

/** Top-level layout component for this application. Called in imports/startup/client/startup.tsx. */
const App = () => (
  <Router>
    <Switch>
      {routes.LANDING.map((route) => (
        <Route key={route.path} {...route} />
      ))}
      {routes.ADMIN.map((route) => (
        <AdminProtectedRoute key={route.path} {...route} />
      ))}
      {routes.ADVISOR.map((route) => (
        <AdvisorProtectedRoute key={route.path} {...route} />
      ))}
      {routes.FACULTY.map((route) => (
        <FacultyProtectedRoute key={route.path} {...route} />
      ))}
      {routes.MENTOR.map((route) => (
        <MentorProtectedRoute key={route.path} {...route} />
      ))}
      {routes.STUDENT.map((route) => (
        <StudentProtectedRoute key={route.path} {...route} />
      ))}
      {routes.ALUMNI.map((route) => (
        <StudentProtectedRoute key={route.path} {...route} />
      ))}
      <Route path="/signin" component={Signin} />
      <ProtectedRoute path="/signout" component={Signout} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props: any) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => {
  const WrappedComponent = withGlobalSubscription(Component);
  return (
    <Route
      {...rest}
      render={(props: any) => {
        const userId = Meteor.userId();
        const isLogged = userId !== null;
        const isAdmin = Roles.userIsInRole(userId, [ROLE.ADMIN]);
        return (isLogged && isAdmin) ?
          (<WrappedComponent {...props} />) :
          (<Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
          );
      }}
    />
  );
};

const AdvisorProtectedRoute = ({ component: Component, ...rest }) => {
  const WrappedComponent = withInstanceSubscriptions(withGlobalSubscription(Component));
  return (
    <Route
      {...rest}
      render={(props: any) => {
        const isLogged = Meteor.userId() !== null;
        const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.ADVISOR]);
        return (isLogged && isAllowed) ?
          (<WrappedComponent {...props} />) :
          (<Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
          );
      }}
    />
  );
};

const FacultyProtectedRoute = ({ component: Component, ...rest }) => {
  const WrappedComponent = withInstanceSubscriptions(withGlobalSubscription(Component));
  return (
    <Route
      {...rest}
      render={(props: any) => {
        const isLogged = Meteor.userId() !== null;
        const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.FACULTY]);
        return (isLogged && isAllowed) ?
          (<WrappedComponent {...props} />) :
          (<Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
          );
      }}
    />
  );
};

const MentorProtectedRoute = ({ component: Component, ...rest }) => {
  const WrappedComponent = withInstanceSubscriptions(withGlobalSubscription(Component));
  return (
    <Route
      {...rest}
      render={(props: any) => {
        const isLogged = Meteor.userId() !== null;
        const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.MENTOR]);
        return (isLogged && isAllowed) ?
          (<WrappedComponent {...props} />) :
          (<Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
          );
      }}
    />
  );
};

const StudentProtectedRoute = ({ component: Component, ...rest }) => {
  const ComponentWithSubscriptions = withInstanceSubscriptions(withGlobalSubscription(Component));
  const isStudent = Roles.userIsInRole(Meteor.userId(), ROLE.STUDENT);
  // Because ROLE.ADMIN and ROLE.ADVISOR are allowed to go to StudentProtectedRoutes, they can trigger the
  // userInteractionDefineMethod.call() inside of withHistoryListen. Since we only want to track the pageViews of
  // STUDENTS, we should only use withHistoryListen if LOGGED IN user is a student.
  const WrappedComponent = isStudent ? withPageTracker(ComponentWithSubscriptions) : ComponentWithSubscriptions;
  return (
    <Route
      {...rest}
      render={(props: any) => {
        const userId = Meteor.userId();
        const isLogged = userId !== null;
        if (!isLogged) {
          return (<Redirect to={{ pathname: '/signin', state: { from: props.location } }} />);
        }
        let isAllowed = Roles.userIsInRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
        const routeUsername = getUsername(props.match);
        const loggedInUserName = Users.getProfile(userId).username;
        if (isStudent) {
          isAllowed = routeUsername === loggedInUserName;
        }
        return (isAllowed) ?
          (<WrappedComponent {...props} />) :
          (<NotAuthorized />);
      }}
    />
  );
};

export default withGlobalSubscription(App);
