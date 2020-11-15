import React from 'react';
import { Header, Icon, Grid } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { buildRouteName, IMatchProps } from '../../shared/utilities/router';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
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

const StudentHomeFavoriteInterestsList = (props: IPopularTopicsProps) => {
  const { match } = props;
  const favoriteInterests = getFavoriteInterests();
  const marginTopStyle: React.CSSProperties = { marginTop: '30px' };
  const whiteColorStyle: React.CSSProperties = { color: 'white' };
  const gridRowStyle: React.CSSProperties = { backgroundColor: '#53A78F', borderRadius: '3px', marginTop: '10px' };
  return (
    <div style={marginTopStyle}>
      <Header>FAVORITE INTERESTS SELECTED BY ICS STUDENTS</Header>
      <Grid>
        {favoriteInterests.map((object) => {
          const slug = Interests.findSlugByID(object.interestID);
          const interest: IInterest = Interests.findDocBySlug(slug);
          const name = interest.name;
          return (
            <Grid.Row key={object.interestID} style={gridRowStyle} columns={2}>
              <Grid.Column width={13}>
                <Link
                  style={whiteColorStyle}
                  to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slug}`)}
                >
                  #{name.toUpperCase()}
                </Link>
              </Grid.Column>
              <Grid.Column style={whiteColorStyle} width={3}>
                <Icon name="user circle" /> {object.count}
              </Grid.Column>
            </Grid.Row>
          );
        })}
      </Grid>
    </div>
  );
};

export default withRouter(StudentHomeFavoriteInterestsList);
