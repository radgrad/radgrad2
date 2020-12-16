// import React from 'react';
// import { Header, Icon, Label } from 'semantic-ui-react';
// import { Link, useRouteMatch } from 'react-router-dom';
// import { buildRouteName } from '../../shared/utilities/router';
// import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
// import { Interests } from '../../../../api/interest/InterestCollection';
// import { FavoriteInterests } from '../../../../api/favorite/FavoriteInterestCollection';
// import { FavoriteInterest, Interest } from '../../../../typings/radgrad';
//
// const countInArray = (array, value) => array.reduce((n, x) => n + (x === value), 0);
//
// // TODO Should this be responsive?
//
// const getFavoriteInterests = () => {
//   const favInterests: FavoriteInterest[] = FavoriteInterests.findNonRetired({});
//   const favInterestIDs = favInterests.map((favInterest) => favInterest.interestID);
//   const favInterestObjects = [];
//   favInterestIDs.forEach((id) => {
//     const count = countInArray(favInterestIDs, id);
//     favInterestObjects.push({ interestID: id, count: count });
//   });
//   // Sort in descending order
//   favInterestObjects.sort((a, b) => ((a.count < b.count) ? 1 : -1));
//   // Only get the first 10 items
//   return favInterestObjects.slice(0, 10);
// };
//
// const FavoriteInterestsList = () => {
//   const match = useRouteMatch();
//   const favoriteInterests = getFavoriteInterests();
//   return (
//     <>
//       <Header dividing>FAVORITE INTERESTS SELECTED BY ICS STUDENTS</Header>
//       <Label.Group>
//         {favoriteInterests.map((object) => {
//           const slug = Interests.findSlugByID(object.interestID);
//           const interest: Interest = Interests.findDocBySlug(slug);
//           const name = interest.name;
//           return (
//             <Label
//               as={Link}
//               key={object.interestID}
//               to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slug}`)}
//             >
//               # {name.toUpperCase()}
//               <Icon name="user circle" /> {object.count}
//             </Label>
//           );
//         })}
//       </Label.Group>
//     </>
//   );
// };
//
// export default FavoriteInterestsList;
