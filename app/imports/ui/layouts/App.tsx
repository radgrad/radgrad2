import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import '/public/semantic.min.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signout from '../pages/Signout';
import { ROLE } from '../../api/role/Role';
import { routes } from '../../startup/client/routes-config';
import withGlobalSubscription from './shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from './shared/InstanceSubscriptionsHOC';
import { userInteractionDefineMethod } from '../../api/analytic/UserInteractionCollection.methods';
import { getAllUrlParamsByLocationObject } from '../components/shared/RouterHelperFunctions';
import { UserInteractionsTypes } from '../../api/analytic/UserInteractionsTypes';
import { routerTrackerActions } from '../../redux/router';

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
  const WrappedComponent = withInstanceSubscriptions(withGlobalSubscription(Component));
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

function withHistoryListen(WrappedComponent) {
  interface IHistoryListenProps {
    history: {
      listen: (...args) => any;
    };
    match: {
      isExact: boolean;
      path: string;
      url: string;
      params: {
        username: string;
      }
    };
    lastPathname: string;
    setLastPathname: (lastPathname: string) => any;
    locationObject: any;
  }

  const mapStateToProps = (state): object => ({
    lastPathname: state.routeTracker.lastPathname,
    locationObject: state.router.location,
  });

  const mapDispatchToProps = (dispatch: any): object => ({
    setLastPathname: (lastPathname: string) => dispatch(routerTrackerActions.setLastPathname(lastPathname)),
  });

  class HistoryListen extends React.Component<IHistoryListenProps> {
    private readonly unlisten;

    constructor(props) {
      super(props);
      // const { history, match } = props;
      // const { lastPathname, locationObject } = this.props;
      // this.unlisten = history.listen((location, action) => {
      //   // if (lastPathname === locationObject.pathname) {
      //   //   console.log('triggered1');
      //   //   console.log('locationPathname ', locationObject.pathname);
      //   //   console.log('lastpathname ', lastPathname);
      //   // } else {
      //   console.log('trig2');
      //   console.log('lastPathname ', this.props.lastPathname);
      //   const parameters = getAllUrlParamsByLocationObject(match, locationObject);
      //   const typeData = parameters.join('/');
      //   // console.log('Currentl Url Params: %o\nLocation: %o\nAction: %o', typeData, location, action);
      //   const username = Meteor.user().username;
      //   const type = UserInteractionsTypes.PAGEVIEW;
      //   const interactionData = { username, type, typeData };
      //   userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
      //     if (userInteractionError) {
      //       console.log('Error creating UserInteraction.', userInteractionError);
      //     }
      //   });
      // }
      // });
    }

    componentDidUpdate(prevProps: Readonly<IHistoryListenProps>, prevState: Readonly<{}>, snapshot?: any): void {
      if (prevProps.locationObject !== this.props.locationObject) {
        const parameters = getAllUrlParamsByLocationObject(this.props.match, this.props.locationObject);
        const typeData = parameters.join('/');
        const username = Meteor.user().username;
        const type = UserInteractionsTypes.PAGEVIEW;
        const interactionData = { username, type, typeData };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.log('Error creating UserInteraction.', userInteractionError);
          }
        });
      }
    }

    componentWillUnmount(): void {
      // this.unlisten();
      // this.props.setLastPathname(this.props.match.url);
    }

    public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
      return <WrappedComponent {...this.props} />;
    }
  }

  return withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoryListen));
}

const StudentProtectedRoute = ({ component: Component, ...rest }) => {
  const ComponentWithSubscriptions = withInstanceSubscriptions(withGlobalSubscription(Component));
  // const isStudent = Roles.userIsInRole(Meteor.userId(), ROLE.STUDENT);
  const isStudent = true; // TODO revert
  // Because ROLE.ADMIN and ROLE.ADVISOR are allowed to go to StudentProtectedRoutes, they can trigger the userInteractionDefineMethod.call()
  // inside of withHistoryListen. Since we only want to track the pageViews of STUDENTS, we should only use withHistoryListen
  // if LOGGED IN user is a student.
  const WrappedComponent = isStudent ? withHistoryListen(ComponentWithSubscriptions) : ComponentWithSubscriptions;
  return (
    <Route
      {...rest}
      render={(props: any) => {
        const userId = Meteor.userId();
        const isLogged = userId !== null;
        const isAllowed = Roles.userIsInRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
        return (isLogged && isAllowed) ?
          (<WrappedComponent {...props} />) :
          (<Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
          );
      }}
    />
  );
};

export default withInstanceSubscriptions(withGlobalSubscription(App));
