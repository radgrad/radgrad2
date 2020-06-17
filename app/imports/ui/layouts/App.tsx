import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { HashRouter as Router, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import '/public/semantic.min.css';
import { connect } from 'react-redux';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signout from '../pages/Signout';
import { ROLE } from '../../api/role/Role';
import { routes } from '../../startup/client/routes-config';
import withGlobalSubscription from './shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from './shared/InstanceSubscriptionsHOC';
import { userInteractionDefineMethod } from '../../api/analytic/UserInteractionCollection.methods';
import {
  getAllUrlParamsByLocationObject,
  getUsername,
  ILocationProps,
} from '../components/shared/RouterHelperFunctions';
import { Users } from '../../api/user/UserCollection';
import { UserInteractionsTypes } from '../../api/analytic/UserInteractionsTypes';
import { EXPLORER_TYPE } from '../../startup/client/route-constants';
import { IPageInterest, IPageInterestDefine, ISlug } from '../../typings/radgrad';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../api/page-tracking/PageInterestsCategoryTypes';
import { pageInterestDefineMethod } from '../../api/page-tracking/PageInterestCollection.methods';
import { Slugs } from '../../api/slug/SlugCollection';
import { RootState } from '../../redux/types';
import NotAuthorized from '../pages/NotAuthorized';
import { PageInterests } from '../../api/page-tracking/PageInterestCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Courses } from '../../api/course/CourseCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';

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

// TODO: Turn this class into a separate pure function and move this function to another file
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

  const getDescriptionText = (type, slugName) => {
    const id = Slugs.findOne({ name: slugName })._id;
    switch (type) {
      case 'CareerGoal':
        return CareerGoals.findOne({ slugID: id }).description;
      case 'Course':
        return Courses.findOne({ slugID: id }).description;
      case 'Interest':
        return Interests.findOne({ slugID: id }).description;
      case 'Opportunity':
        return Opportunities.findOne({ slugID: id }).description;
      default:
        console.error(`Bad entityName: ${type}`);
        break;
    }
    return undefined;
  };

  // Calculates how long to wait (since the time the student has opened the page) before they're considered "interested" in that item
  const calculateEngagedInterestTime = (slugName: string): number => {
    const slug: ISlug = Slugs.findOne({ name: slugName });
    const type = slug.entityName;
    const descriptionText = getDescriptionText(type, slugName);

    const descriptionTextStrings: string[] = descriptionText.split(' ');
    const removedHttpLinks: string[] = descriptionTextStrings.filter((str) => !str.includes('http')); // Remove the Markdown http links
    const validWordLength: number = 3; // Number of characters for a string to be considered a "word"
    const validDescriptionTextStrings: string[] = removedHttpLinks.filter((str) => str.length >= validWordLength); // Remove strings that aren't "valid words"
    const isLongDescriptionText: boolean = validDescriptionTextStrings.length > 50; // If there are more than 50 words, it's considered a long description

    const wpm = isLongDescriptionText ? 275 : 250; // Words per minute. We expect that the longer a description is, the faster a english-literate college student reads
    // We expect that in order for a student to have been considered "interested" in the item they're reading
    // that they have read around half of the words in the description
    const expectedNumberOfWords = validDescriptionTextStrings.length / 2;
    const estimatedReadingTime = (expectedNumberOfWords / wpm) * 60 * 1000; // Based on the WPM, the estimated time it would take to read half of the description (in milliseconds)
    // As reading experience and time varies between students (in the sense that they might not read everything word by word),
    // we only expect that they have spent a minimum of half of the estimated reading time for reading half of the description
    // to be considered "interested" in that item
    const expectedReadingTime = estimatedReadingTime / 2;

    // Students may not necessarily start reading the description as soon as they enter the page.
    // If it is a longer description, they might spend some time skimming the page first before reading. (in milliseconds)
    const initiationTime = isLongDescriptionText ? 1500 : 1000;

    return expectedReadingTime + initiationTime;
  };

  class HistoryListen extends React.Component<IHistoryListenProps> {
    private timeoutHandle;

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

        const isValidParameter = (p) => p === EXPLORER_TYPE.CAREERGOALS || p === EXPLORER_TYPE.COURSES || p === EXPLORER_TYPE.INTERESTS || p === EXPLORER_TYPE.OPPORTUNITIES;
        const urlCategory = parameters[1];
        const urlSlug = parameters[2];
        // Defining Page Interests
        if (parameters[0] === EXPLORER_TYPE.HOME && urlSlug && isValidParameter(urlCategory)) {
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
          switch (urlCategory) {
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
          }
          const pageInterest: IPageInterest = PageInterests.findOne({ name: urlSlug });
          // Only define a PageInterest if there hasn't been one defined for the past 24 hours.
          if (!pageInterest) {
            const engagedInterestTime = calculateEngagedInterestTime(urlSlug);
            const pageInterestData: IPageInterestDefine = { username, category, name: urlSlug };
            this.timeoutHandle = Meteor.setTimeout(() => {
              pageInterestDefineMethod.call(pageInterestData, (pageInterestError) => {
                if (pageInterestError) {
                  console.error('Error creating PageInterest.', pageInterestError);
                }
              });
            }, engagedInterestTime);
          }
        }
      }
    }

    componentWillUnmount() {
      Meteor.clearTimeout(this.timeoutHandle);
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

export default withInstanceSubscriptions(withGlobalSubscription(App));
