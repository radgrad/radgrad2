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
import { getAllUrlParamsByLocationObject, ILocationProps } from '../components/shared/RouterHelperFunctions';
import { UserInteractionsTypes } from '../../api/analytic/UserInteractionsTypes';
import { EXPLORER_TYPE } from '../../startup/client/route-constants';
import { IPageInterestDefine } from '../../typings/radgrad';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../api/page-tracking/PageInterestsCategoryTypes';
import { pageInterestDefineMethod } from '../../api/page-tracking/PageInterestCollection.methods';
import { Slugs } from '../../api/slug/SlugCollection';
import { RootState } from '../../redux/types';

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
    router: {
      location: ILocationProps;
      action: string;
    };
  }

  const mapStateToProps = (state: RootState): object => ({
    router: state.router,
  });

  // TODO: Turn this class into a pure function
  class HistoryListen extends React.Component<IHistoryListenProps> {
    componentDidUpdate(prevProps: Readonly<IHistoryListenProps>, prevState: Readonly<{}>, snapshot?: any): void {
      const { match, router } = this.props;
      if (prevProps.router.location !== router.location) {
        // Defining User Interactions
        const parameters = getAllUrlParamsByLocationObject(match, router.location);
        const typeData = parameters.join('/');
        const username = Meteor.user().username;
        const type = UserInteractionsTypes.PAGEVIEW;
        const interactionData = { username, type, typeData };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.error('Error creating UserInteraction.', userInteractionError);
          }
        });

        // Defining Page Interests
        if (parameters[0] === EXPLORER_TYPE.HOME && parameters[2]) {
          // Don't create a PageInterest in case we ever change how the URL of Explorer Pages are structured
          // since we're directly accessing parameters for data
          if (parameters.length > 3) {
            console.error('Invalid length of parameters: %o', parameters);
            return;
          }
          // OR the user is trying to visit a specific page that no longer exists.
          if (!Slugs.isDefined(parameters[2])) {
            return;
          }
          let category: IPageInterestsCategoryTypes;
          switch (parameters[1]) {
            case EXPLORER_TYPE.CAREERGOALS:
              category = PageInterestsCategoryTypes.CAREERGOAL;
              break;
            case EXPLORER_TYPE.COURSES:
              category = PageInterestsCategoryTypes.COURSE;
              break;
            case EXPLORER_TYPE.INTERESTS:
              category = PageInterestsCategoryTypes.INTEREST;
              break;
            case EXPLORER_TYPE.OPPORTUNITIES:
              category = PageInterestsCategoryTypes.OPPORTUNITY;
              break;
            default:
              // We only track and define Page Interests for the case statements above
          }
          // TODO: Implementation of Page Interest View defining
          const pageInterestData: IPageInterestDefine = { username, category, name: parameters[2] };
          pageInterestDefineMethod.call(pageInterestData, (pageInterestError) => {
            if (pageInterestError) {
              console.error('Error creating PageInterest.', pageInterestError);
            }
          });
        }
      }
    }

    public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
      return <WrappedComponent {...this.props} />;
    }
  }

  return withRouter(connect(mapStateToProps)(HistoryListen));
}

const StudentProtectedRoute = ({ component: Component, ...rest }) => {
  const ComponentWithSubscriptions = withInstanceSubscriptions(withGlobalSubscription(Component));
  const isStudent = Roles.userIsInRole(Meteor.userId(), ROLE.STUDENT);
  // Because ROLE.ADMIN and ROLE.ADVISOR are allowed to go to StudentProtectedRoutes, they can trigger the
  // userInteractionDefineMethod.call() inside of withHistoryListen. Since we only want to track the pageViews of
  // STUDENTS, we should only use withHistoryListen if LOGGED IN user is a student.
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
