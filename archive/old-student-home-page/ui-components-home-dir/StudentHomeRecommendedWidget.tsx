// import React from 'react';
// import { Header } from 'semantic-ui-react';
// import { useRouteMatch } from 'react-router-dom';
// import _ from 'lodash';
// import { Teaser } from '../../../../typings/radgrad';
// import { Teasers } from '../../../../api/teaser/TeaserCollection';
// import { Users } from '../../../../api/user/UserCollection';
// import { getUsername } from '../../shared/utilities/router';
// import { Interests } from '../../../../api/interest/InterestCollection';
// import RecommendedItemInformation from './RecommendedItemInformation';
//
// const StudentHomeRecommendedWidget: React.FC = () => {
//   const match = useRouteMatch();
//   const getRecommendedTeasers = (): Teaser[] => {
//     const allTeasers: Teaser[] = Teasers.findNonRetired({});
//     const matching = [];
//     const username = getUsername(match);
//     const profile = Users.getProfile(username);
//     const userInterests = [];
//     let teaserInterests = [];
//     _.forEach(Users.getInterestIDs(profile.userID), (id) => {
//       userInterests.push(Interests.findDoc(id));
//     });
//     _.forEach(allTeasers, (teaser) => {
//       teaserInterests = [];
//       _.forEach(teaser.interestIDs, (id) => {
//         teaserInterests.push(Interests.findDoc(id));
//         _.forEach(teaserInterests, (teaserInterest) => {
//           _.forEach(userInterests, (userInterest) => {
//             if (_.isEqual(teaserInterest, userInterest)) {
//               if (!_.includes(matching, teaser)) {
//                 matching.push(teaser);
//               }
//             }
//           });
//         });
//       });
//     });
//     return matching;
//   };
//
//   const numberOfTeasers = 4;
//   const recommendedTeasers = getRecommendedTeasers().slice(0, numberOfTeasers);
//
//   return (
//     <>
//       <Header>RECOMMENDED COURSES & OPPORTUNITIES</Header>
//       {recommendedTeasers.map((teaser) => (
//         <RecommendedItemInformation key={teaser._id} teaser={teaser} />
//       ))}
//     </>
//   );
// };
//
// export default StudentHomeRecommendedWidget;
