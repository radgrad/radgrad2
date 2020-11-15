import React from 'react';
import { Header, Icon, Label } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { buildRouteName, IMatchProps } from '../../shared/router-helper-functions';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';
import { Interests } from '../../../../api/interest/InterestCollection';
import { FavoriteInterests } from '../../../../api/favorite/FavoriteInterestCollection';
import { IFavoriteInterest, IInterest } from '../../../../typings/radgrad';

interface IPopularTopicsProps {
  match: IMatchProps;
}

const countInArray = (array, value) => array.reduce((n, x) => n + (x === value), 0);

const getFavoriteInterests = () => {
  const favInterests: IFavoriteInterest[] = FavoriteInterests.findNonRetired({});
  const favInterestIDs = favInterests.map((favInterest) => favInterest.interestID);
  const favInterestObjects = [];
  favInterestIDs.forEach((id) => {
    const count = countInArray(favInterestIDs, id);
    favInterestObjects.push({ interestID: id, count: count });
  });
  // Sort in descending order
  favInterestObjects.sort((a, b) => ((a.count < b.count) ? 1 : -1));
  // Only get the first 10 items
  return favInterestObjects.slice(0, 10);
};

const FavoriteInterestsList = (props: IPopularTopicsProps) => {
  const { match } = props;
  const favoriteInterests = getFavoriteInterests();
  return (
    <>
      <Header dividing>FAVORITE INTERESTS SELECTED BY ICS STUDENTS</Header>
      <Label.Group>
        {favoriteInterests.map((object) => {
          const slug = Interests.findSlugByID(object.interestID);
          const interest: IInterest = Interests.findDocBySlug(slug);
          const name = interest.name;
          return (
            <Label
              as={Link}
              key={object.interestID}
              to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slug}`)}
            >
              # {name.toUpperCase()}
              <Icon name="user circle" /> {object.count}
            </Label>
          );
        })}
      </Label.Group>
    </>
  );
};

export default withRouter(FavoriteInterestsList);
