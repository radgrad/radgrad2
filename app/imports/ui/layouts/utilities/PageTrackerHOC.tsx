import React, { useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllUrlParamsByLocationObject, getUsername, LocationProps } from '../../components/shared/utilities/router';
import { RootState } from '../../../redux/types';
import { Slugs } from '../../../api/slug/SlugCollection';
import { PageInterestDefine } from '../../../typings/radgrad';
import { UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { EXPLORER_TYPE } from './route-constants';
import { IPageInterestsCategoryTypes, PageInterestsCategoryTypes } from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { pageInterestDefineMethod } from '../../../api/page-tracking/PageInterestCollection.methods';
import { calculateEngagedInterestTime, isValidParameter } from '../../components/shared/page-tracking/utilities/page-tracking';

interface PageTrackerProps {
  history: {
    listen: (...args) => any;
  };
  router: {
    location: LocationProps;
    action: string;
  };
}

const mapStateToProps = (state: RootState): unknown => ({
  router: state.router,
});

function usePreviousProps(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function withPageTracker(WrappedComponent) {
  const PageTracker: React.FC<PageTrackerProps> = (props) => {
    const prevProps = usePreviousProps(props);
    const match = useRouteMatch();
    const { router } = props;
    useEffect(() => {
      // @ts-ignore
      if (prevProps && prevProps.router.location !== router.location) {
        let timeoutHandle; // Page Interest Views Tracking

        /* ########## User Interactions ########## */
        const parameters = getAllUrlParamsByLocationObject(match, router.location);
        const typeData = parameters.join('/');
        const username = getUsername(match);
        const type = UserInteractionsTypes.PAGEVIEW;
        const interactionData = { username, type, typeData };
        userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
          if (userInteractionError) {
            console.error('Error creating UserInteraction.', userInteractionError);
          }
        });

        /* ########## Page Interest Views ########## */
        const urlCategory = parameters[1];
        const urlSlug = parameters[2];
        // Defining Page Interests
        if (parameters[0] === EXPLORER_TYPE.HOME && urlSlug && isValidParameter(urlCategory)) {
          // Don't create a PageInterest in case we ever change how the URL of Explorer Pages are structured
          // since we're directly accessing parameters for data
          if (parameters.length > 3) {
            console.error('Invalid length of parameters (expected 3): %o', parameters.length);
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
          const engagedInterestTime = calculateEngagedInterestTime(urlSlug);
          const pageInterestData: PageInterestDefine = { username, category, name: urlSlug };
          timeoutHandle = Meteor.setTimeout(() => {
            pageInterestDefineMethod.call(pageInterestData, (pageInterestError) => {
              if (pageInterestError) {
                console.error('Error creating PageInterest.', pageInterestError);
              }
            });
          }, engagedInterestTime);
        }
        // componentWillUnmount
        // eslint-disable-next-line consistent-return
        return () => {
          Meteor.clearTimeout(timeoutHandle);
        };
      }
    }, [match, prevProps, router.location]);

    return <WrappedComponent {...props} />;
  };

  return connect(mapStateToProps)(PageTracker);
}

export default withPageTracker;

// Same exact functionality but using Class instead of pure function; leaving this here just in case
// function withHistoryListen(WrappedComponent) {
//   interface IHistoryListenProps {
//     history: {
//       listen: (...args) => any;
//     };
//     match: {
//       isExact: boolean;
//       path: string;
//       url: string;
//       params: {
//         username: string;
//       }
//     };
//     router: {
//       location: LocationProps;
//       action: string;
//     };
//   }
//
//   const mapStateToProps = (state: RootState): object => ({
//     router: state.router,
//   });
//
//   class HistoryListen extends React.Component<IHistoryListenProps> {
//     private timeoutHandle;
//
//     componentDidUpdate(prevProps: Readonly<IHistoryListenProps>, prevState: Readonly<{}>, snapshot?: any): void {
//       const { match, router } = this.props;
//       if (prevProps.router.location !== router.location) {
//         // Defining User Interactions
//         const parameters = getAllUrlParamsByLocationObject(match, router.location);
//         const typeData = parameters.join('/');
//         const username = Meteor.user().username;
//         const type = UserInteractionsTypes.PAGEVIEW;
//         const interactionData = { username, type, typeData };
//         userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
//           if (userInteractionError) {
//             console.error('Error creating UserInteraction.', userInteractionError);
//           }
//         });
//
//         const urlCategory = parameters[1];
//         const urlSlug = parameters[2];
//         // Defining Page Interests
//         if (parameters[0] === EXPLORER_TYPE.HOME && urlSlug && isValidParameter(urlCategory)) {
//           // Don't create a PageInterest in case we ever change how the URL of Explorer Pages are structured
//           // since we're directly accessing parameters for data
//           if (parameters.length > 3) {
//             console.error('Invalid length of parameters: %o', parameters);
//             return;
//           }
//           // OR the user is trying to visit a specific page that no longer exists.
//           if (!Slugs.isDefined(parameters[2])) {
//             return;
//           }
//           let category: IPageInterestsCategoryTypes;
//           switch (urlCategory) {
//             case EXPLORER_TYPE.CAREERGOALS:
//               category = PageInterestsCategoryTypes.CAREERGOAL;
//               break;
//             case EXPLORER_TYPE.COURSES:
//               category = PageInterestsCategoryTypes.COURSE;
//               break;
//             case EXPLORER_TYPE.INTERESTS:
//               category = PageInterestsCategoryTypes.INTEREST;
//               break;
//             case EXPLORER_TYPE.OPPORTUNITIES:
//               category = PageInterestsCategoryTypes.OPPORTUNITY;
//               break;
//           }
//           const pageInterest: PageInterest = PageInterests.findOne({ name: urlSlug });
//           // Only define a PageInterest if there hasn't been one defined for the past 24 hours.
//           if (!pageInterest) {
//             const engagedInterestTime = calculateEngagedInterestTime(urlSlug);
//             const pageInterestData: PageInterestDefine = { username, category, name: urlSlug };
//             this.timeoutHandle = Meteor.setTimeout(() => {
//               pageInterestDefineMethod.call(pageInterestData, (pageInterestError) => {
//                 if (pageInterestError) {
//                   console.error('Error creating PageInterest.', pageInterestError);
//                 }
//               });
//             }, engagedInterestTime);
//           }
//         }
//       }
//     }
//
//     componentWillUnmount() {
//       Meteor.clearTimeout(this.timeoutHandle);
//     }
//
//     public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
//       return <WrappedComponent {...this.props} />;
//     }
//   }
//
//   return withRouter(connect(mapStateToProps)(HistoryListen));
// }
