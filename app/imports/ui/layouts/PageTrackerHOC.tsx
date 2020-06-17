// import React, { useEffect } from 'react';
// import { Meteor } from 'meteor/meteor';
// import { withRouter } from 'react-router-dom';
// import { connect } from 'react-redux';
// import {
//   getAllUrlParamsByLocationObject,
//   ILocationProps,
//   IMatchProps,
// } from '../components/shared/RouterHelperFunctions';
// import { RootState } from '../../redux/types';
// import { Slugs } from '../../api/slug/SlugCollection';
// import { CareerGoals } from '../../api/career/CareerGoalCollection';
// import { Courses } from '../../api/course/CourseCollection';
// import { Interests } from '../../api/interest/InterestCollection';
// import { Opportunities } from '../../api/opportunity/OpportunityCollection';
// import { IPageInterest, IPageInterestDefine, ISlug } from '../../typings/radgrad';
// import { UserInteractionsTypes } from '../../api/analytic/UserInteractionsTypes';
// import { userInteractionDefineMethod } from '../../api/analytic/UserInteractionCollection.methods';
// import { EXPLORER_TYPE } from '../../startup/client/route-constants';
// import {
//   IPageInterestsCategoryTypes,
//   PageInterestsCategoryTypes,
// } from '../../api/page-tracking/PageInterestsCategoryTypes';
// import { PageInterests } from '../../api/page-tracking/PageInterestCollection';
// import { pageInterestDefineMethod } from '../../api/page-tracking/PageInterestCollection.methods';
//
// interface IPageTrackerProps {
//   history: {
//     listen: (...args) => any;
//   };
//   match: IMatchProps
//   router: {
//     location: ILocationProps;
//     action: string;
//   };
// }
//
// const mapStateToProps = (state: RootState): object => ({
//   router: state.router,
// });
//
// function withPageTracker(WrappedComponent) {
//   const getDescriptionText = (type, slugName) => {
//     const id = Slugs.findOne({ name: slugName })._id;
//     switch (type) {
//       case 'CareerGoal':
//         return CareerGoals.findOne({ slugID: id }).description;
//       case 'Course':
//         return Courses.findOne({ slugID: id }).description;
//       case 'Interest':
//         return Interests.findOne({ slugID: id }).description;
//       case 'Opportunity':
//         return Opportunities.findOne({ slugID: id }).description;
//       default:
//         console.error(`Bad entityName: ${type}`);
//         break;
//     }
//     return undefined;
//   };
//
//   // Calculates how long to wait (since the time the student has opened the page) before they're considered "interested" in that item
//   const calculateEngagedInterestTime = (slugName: string): number => {
//     const slug: ISlug = Slugs.findOne({ name: slugName });
//     const type = slug.entityName;
//     const descriptionText = getDescriptionText(type, slugName);
//
//     const descriptionTextStrings: string[] = descriptionText.split(' ');
//     const removedHttpLinks: string[] = descriptionTextStrings.filter((str) => !str.includes('http')); // Remove the Markdown http links
//     const validWordLength: number = 3; // Number of characters for a string to be considered a "word"
//     const validDescriptionTextStrings: string[] = removedHttpLinks.filter((str) => str.length >= validWordLength); // Remove strings that aren't "valid words"
//     const isLongDescriptionText: boolean = validDescriptionTextStrings.length > 50; // If there are more than 50 words, it's considered a long description
//
//     const wpm = isLongDescriptionText ? 275 : 250; // Words per minute. We expect that the longer a description is, the faster a english-literate college student reads
//     // We expect that in order for a student to have been considered "interested" in the item they're reading
//     // that they have read around half of the words in the description
//     const expectedNumberOfWords = validDescriptionTextStrings.length / 2;
//     const estimatedReadingTime = (expectedNumberOfWords / wpm) * 60 * 1000; // Based on the WPM, the estimated time it would take to read half of the description (in milliseconds)
//     // As reading experience and time varies between students (in the sense that they might not read everything word by word),
//     // we only expect that they have spent a minimum of half of the estimated reading time for reading half of the description
//     // to be considered "interested" in that item
//     const expectedReadingTime = estimatedReadingTime / 2;
//
//     // Students may not necessarily start reading the description as soon as they enter the page.
//     // If it is a longer description, they might spend some time skimming the page first before reading. (in milliseconds)
//     const initiationTime = isLongDescriptionText ? 1500 : 1000;
//     return expectedReadingTime + initiationTime;
//   };
//
//   const PageTracker = (props: IPageTrackerProps) => {
//     useEffect(() => {
//       let timeoutHandle;
//
//       // componentWillUnmount
//       return () => {
//         Meteor.clearTimeout(timeoutHandle);
//       };
//     }, [props.router.location]);
//
//     return (
//       <WrappedComponent {...props} />
//     );
//   };
//
//   class HistoryListen extends React.Component<IPageTrackerProps> {
//     private timeoutHandle;
//
//     componentDidUpdate(prevProps: Readonly<IPageTrackerProps>, prevState: Readonly<{}>, snapshot?: any): void {
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
//         const isValidParameter = (p) => p === EXPLORER_TYPE.CAREERGOALS || p === EXPLORER_TYPE.COURSES || p === EXPLORER_TYPE.INTERESTS || p === EXPLORER_TYPE.OPPORTUNITIES;
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
//           const pageInterest: IPageInterest = PageInterests.findOne({ name: urlSlug });
//           // Only define a PageInterest if there hasn't been one defined for the past 24 hours.
//           if (!pageInterest) {
//             const engagedInterestTime = calculateEngagedInterestTime(urlSlug);
//             const pageInterestData: IPageInterestDefine = { username, category, name: urlSlug };
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
//   return withRouter(connect(mapStateToProps)(PageTracker));
// }
//
// export default withPageTracker;
