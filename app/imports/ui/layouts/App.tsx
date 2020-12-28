import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import _ from 'lodash';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import '/public/semantic.min.css';
import { StudentProfiles } from '../../api/user/StudentProfileCollection';
import NotFoundPage from '../pages/NotFoundPage';
import SigninPage from '../pages/SigninPage';
import SignoutPage from '../pages/SignoutPage';
import { ROLE } from '../../api/role/Role';
import { routes } from './utilities/routes-config';
import withGlobalSubscription from './utilities/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from './utilities/InstanceSubscriptionsHOC';
import {
  getUsername,
} from '../components/shared/utilities/router';
import { Users } from '../../api/user/UserCollection';
import NotAuthorizedPage from '../pages/NotAuthorizedPage';
import withPageTracker from './utilities/PageTrackerHOC';
import withListSubscriptions from './utilities/SubscriptionListHOC';

// Hack to refresh other RadGrad tabs when logged out on one tab
window.addEventListener('storage', function (event) {
  if (event.key === 'logoutEvent' && event.newValue === 'true') {
    window.location.reload();
  }
});

/* Top-level layout component for this application. Called in imports/startup/client/startup.tsx. */
const App: React.FC = () => (
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
      {routes.STUDENT.map((route) => (
        <StudentProtectedRoute key={route.path} {...route} />
      ))}
      {routes.ALUMNI.map((route) => (
        <StudentProtectedRoute key={route.path} {...route} />
      ))}
      <Route path="/signin">
        <SigninPage />
      </Route>
      <ProtectedRoute path="/signout" component={SignoutPage} />
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
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props: any) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
        (<Component {...props} />) :
        // eslint-disable-next-line react/prop-types
        (<Redirect to={{ pathname: '/', state: { from: props.location } }} />
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
  // console.log('AdminProtectedRoute', rest);
  if (_.isNil(Meteor.userId())) {
    return (<Redirect to={{ pathname: '/', state: { from: rest.location } }} />);
  }
  const WrappedComponent = withGlobalSubscription(withInstanceSubscriptions(Component));
  return (
    <Route
      {...rest}
      render={(props: any) => {
        const userId = Meteor.userId();
        const isLogged = userId !== null;
        const isAdmin = Roles.userIsInRole(userId, [ROLE.ADMIN]);
        // console.log('AdminProtectedRoute', props);
        return (isLogged && isAdmin) ?
          (<WrappedComponent {...props} />) :
          (<Redirect to={{ pathname: '/', state: { from: props.location } }} />
          );
      }}
    />
  );
};

const AdvisorProtectedRoute = ({ component: Component, ...rest }) => {
  if (_.isNil(Meteor.userId())) {
    return (<Redirect to={{ pathname: '/', state: { from: rest.location } }} />);
  }
  return (
    <Route
      {...rest}
      render={(props: any) => {
        const isLogged = Meteor.userId() !== null;
        const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.ADVISOR]);
        return (isLogged && isAllowed) ?
          (<Component {...props} />) :
          // eslint-disable-next-line react/prop-types
          (<Redirect to={{ pathname: '/', state: { from: props.location } }} />
          );
      }}
    />
  );
};

const FacultyProtectedRoute = ({ component: Component, ...rest }) => {
  if (_.isNil(Meteor.userId())) {
    return (<Redirect to={{ pathname: '/', state: { from: rest.location } }} />);
  }
  return (
    <Route
      {...rest}
      render={(props: any) => {
        const isLogged = Meteor.userId() !== null;
        const isAllowed = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.FACULTY]);
        return (isLogged && isAllowed) ?
          (<Component {...props} />) :
          // eslint-disable-next-line react/prop-types
          (<Redirect to={{ pathname: '/', state: { from: props.location } }} />
          );
      }}
    />
  );
};

const StudentProtectedRoute = ({ component: Component, ...rest }) => {
  if (_.isNil(Meteor.userId())) {
    return (<Redirect to={{ pathname: '/', state: { from: rest.location } }} />);
  }
  const ComponentWithSubscriptions = withGlobalSubscription(withInstanceSubscriptions(Component));
  const isStudent = Roles.userIsInRole(Meteor.userId(), ROLE.STUDENT);
  // Because ROLE.ADMIN and ROLE.ADVISOR are allowed to go to StudentProtectedRoutes, they can trigger the
  // userInteractionDefineMethod.call() inside of withHistoryListen. Since we only want to track the pageViews of
  // STUDENTS, we should only use withHistoryListen if LOGGED IN user is a student.
  const WrappedComponent = isStudent ? withPageTracker(ComponentWithSubscriptions) : ComponentWithSubscriptions;

  return (
    <Route
      {...rest}
      render={(props: any) => {
        // console.log('StudentProtectedRoute', props);
        const userId = Meteor.userId();
        const isLogged = userId !== null;
        if (!isLogged) {
          // eslint-disable-next-line react/prop-types
          return (<Redirect to={{ pathname: '/', state: { from: props.location } }} />);
        }
        let isAllowed = Roles.userIsInRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
        // eslint-disable-next-line react/prop-types
        const routeUsername = getUsername(props.match);
        const loggedInUserName = Users.getProfile(userId).username;
        if (isStudent) {
          isAllowed = routeUsername === loggedInUserName;
        }
        return (isAllowed) ?
          (<WrappedComponent {...props} />) :
          (<NotAuthorizedPage />);
      }}
    />
  );
};

// export default withGlobalSubscription(App);
export default withListSubscriptions(App, [StudentProfiles.getPublicationName(), Users.getPublicationName()]);
