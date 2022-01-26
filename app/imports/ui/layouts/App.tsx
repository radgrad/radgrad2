import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import React, { useEffect } from 'react';
import _ from 'lodash';
import { useLocation } from 'react-router';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import '/public/semantic.min.css';
import 'semantic-ui-css/components/rating.css';
import NotFoundPage from '../pages/NotFoundPage';
import SigninPage from '../pages/SigninPage';
import SignoutDidntAgreeToTermsPage from '../pages/SignoutDidntAgreeToTermsPage';
import SignoutPage from '../pages/SignoutPage';
import { ROLE } from '../../api/role/Role';
import { routes } from './utilities/routes-config';
import withGlobalSubscription from './utilities/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from './utilities/InstanceSubscriptionsHOC';
import { getUsername } from '../components/shared/utilities/router';
import { Users } from '../../api/user/UserCollection';
import NotAuthorizedPage from '../pages/NotAuthorizedPage';

// Hack to refresh other RadGrad tabs when logged out on one tab
window.addEventListener('storage', (event) => {
  if (event.key === 'logoutEvent' && event.newValue === 'true') {
    window.location.reload();
  }
});

/** Scroll to top when navigating to non-Explorer pages. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  // Disable scroll to top when we are returning to an explorer page so we hold our prior position.
  const doScroll = () => !pathname.endsWith('explorer/opportunities')
    && !pathname.endsWith('explorer/courses')  && !pathname.endsWith('explorer/interests') && !pathname.endsWith('explorer/career-goals');
  useEffect(() => {
    doScroll() && window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/* Top-level layout component for this application. Called in imports/startup/client/startup.tsx. */
const App: React.FC = () => (
  <Router>
    <ScrollToTop/>
    <Switch>
      {routes.LANDING.map((route) => (
        <Route key={route.path} {..._.defaults(route, { exact: true })} />
      ))}
      {routes.ADMIN.map((route) => (
        <AdminProtectedRoute key={route.path} {..._.defaults(route, { exact: true })} />
      ))}
      {routes.ADVISOR.map((route) => (
        <AdvisorProtectedRoute key={route.path} {..._.defaults(route, { exact: true })} />
      ))}
      {routes.FACULTY.map((route) => (
        <FacultyProtectedRoute key={route.path} {..._.defaults(route, { exact: true })} />
      ))}
      {routes.STUDENT.map((route) => (
        <StudentProtectedRoute key={route.path} {..._.defaults(route, { exact: true })} />
      ))}
      {routes.ALUMNI.map((route) => (
        <StudentProtectedRoute key={route.path} {..._.defaults(route, { exact: true })} />
      ))}
      <Route path="/signin">
        <SigninPage />
      </Route>
      <ProtectedRoute path="/signout" component={SignoutPage} />
      <ProtectedRoute path="/signout-refused" component={SignoutDidntAgreeToTermsPage} />
      <Route>
        <NotFoundPage />
      </Route>
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
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => {
  // console.log('AdminProtectedRoute', rest);
  if (_.isNil(Meteor.userId())) {
    return <Redirect to={{ pathname: '/', state: { from: rest.location } }} />;
  }
  const WrappedComponent = withGlobalSubscription(withInstanceSubscriptions(Component));
  return (
    <Route
      {...rest}
      render={(props) => {
        const userId = Meteor.userId();
        const isLogged = userId !== null;
        const isAdmin = Roles.userIsInRole(userId, [ROLE.ADMIN]);
        // console.log('AdminProtectedRoute', props);
        return isLogged && isAdmin ? <WrappedComponent {...props} /> :
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
      }}
    />
  );
};

const AdvisorProtectedRoute = ({ component: Component, ...rest }) => {
  if (_.isNil(Meteor.userId())) {
    return <Redirect to={{ pathname: '/', state: { from: rest.location } }} />;
  }
  const WrappedComponent = withGlobalSubscription(withInstanceSubscriptions(Component));
  return (
    <Route
      {...rest}
      render={(props) => {
        const isLogged = Meteor.userId() !== null;
        const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.ADVISOR]);
        return isLogged && isAllowed ? <WrappedComponent {...props} /> :
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
      }}
    />
  );
};

const FacultyProtectedRoute = ({ component: Component, ...rest }) => {
  if (_.isNil(Meteor.userId())) {
    return <Redirect to={{ pathname: '/', state: { from: rest.location } }} />;
  }
  const WrappedComponent = withGlobalSubscription(withInstanceSubscriptions(Component));
  return (
    <Route
      {...rest}
      render={(props) => {
        const isLogged = Meteor.userId() !== null;
        const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.FACULTY]);
        return isLogged && isAllowed ? <WrappedComponent {...props} /> :
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
      }}
    />
  );
};

const StudentProtectedRoute = ({ component: Component, ...rest }) => {
  // console.log('StudentProtectedRoute', rest.computedMatch.url, rest.location);

  const userId = Meteor.userId();
  if (_.isNil(userId)) {
    return <NotAuthorizedPage role="student" />;
  }
  const isStudent = Roles.userIsInRole(Meteor.userId(), ROLE.STUDENT);
  // Because ROLE.ADMIN and ROLE.ADVISOR are allowed to go to StudentProtectedRoutes, they can trigger the
  // userInteractionDefineMethod.call() inside of withHistoryListen. Since we only want to track the pageViews of
  // STUDENTS, we should only use withHistoryListen if LOGGED IN user is a student.
  // PJ: As of 4/2021, the above issue is no longer relevant; we have moved all UserInteraction defines to server side.
  const WrappedComponent = withGlobalSubscription(withInstanceSubscriptions(Component));
  // console.log(Meteor.user()?.username, Users.count());
  // CAM: I think this happens on a reload so send us back to the LandingPage. By setting the state to where
  //      we are, we can have the LandingPage redirect us back after the subscriptions are done.
  //      It looks like we can get here before the Users.subscribe is done.
  if (_.isNil(Meteor.user())) {
    return <Redirect to={{ pathname: '/', state: { from: rest.location } }} />;
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        // console.log('StudentProtectedRoute', props);
        let isAllowed = Roles.userIsInRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT, ROLE.ALUMNI]);
        let role = 'student';
        if (Roles.userIsInRole(userId, [ROLE.ADMIN])) {
          role = 'admin';
        }
        if (Roles.userIsInRole(userId, [ROLE.ADVISOR])) {
          role = 'admin';
        }
        const routeUsername = getUsername(props.match);
        let loggedInUserName = routeUsername;
        if (Users.hasProfile(userId)) {
          loggedInUserName = Users.getProfile(userId).username;
          if (isStudent) {
            isAllowed = routeUsername === loggedInUserName;
          }
        }
        return isAllowed ? <WrappedComponent {...props} /> : <NotAuthorizedPage role={role} />;
      }}
    />
  );
};

export default App;
