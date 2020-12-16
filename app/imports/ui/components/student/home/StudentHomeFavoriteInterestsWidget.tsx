import React from 'react';
import { Header, Icon, Grid } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { buildRouteName } from '../../shared/utilities/router';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Interest } from '../../../../typings/radgrad';

interface StudentHomeFavoriteInterestsWidgetProps {
  favoriteInterests: { interestID: string, count: number }[];
}

const StudentHomeFavoriteInterestsList: React.FC<StudentHomeFavoriteInterestsWidgetProps> = ({ favoriteInterests }) => {
  const match = useRouteMatch();
  const marginTopStyle: React.CSSProperties = { marginTop: '30px' };
  const whiteColorStyle: React.CSSProperties = { color: 'white' };
  const gridRowStyle: React.CSSProperties = { backgroundColor: '#53A78F', borderRadius: '3px', marginTop: '10px' };
  return (
    <div style={marginTopStyle}>
      <Header>FAVORITE INTERESTS SELECTED BY RADGRAD MEMBERS</Header>
      <Grid>
        {favoriteInterests.map((object) => {
          const slug = Interests.findSlugByID(object.interestID);
          const interest: Interest = Interests.findDocBySlug(slug);
          const name = interest.name;
          return (
            <Grid.Row key={object.interestID} style={gridRowStyle} columns={2}>
              <Grid.Column width={13}>
                <Link
                  style={whiteColorStyle}
                  to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slug}`)}
                >
                  {name.toUpperCase()}
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

export default StudentHomeFavoriteInterestsList;
