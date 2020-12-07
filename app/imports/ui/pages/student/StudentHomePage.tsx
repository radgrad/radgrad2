import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import StudentHomeFavoriteInterestsList from '../../components/student/home/StudentHomeFavoriteInterestsWidget';
import StudentHomeRecommendedWidget from '../../components/student/home/StudentHomeRecommendedWidget';
import StudentHomeBannersWidget from '../../components/student/home/StudentHomeBannersWidget';
import StudentHomeRadGradVideosWidget from '../../components/student/home/StudentHomeRadGradVideosWidget';
import StudentHomeNewOpportunitiesWidget from '../../components/student/home/StudentHomeNewOpportunitiesWidget';
import { buildExplorerRoute, IMatchProps } from '../../components/shared/utilities/router';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import GuidedTourStudentHomePageWidget from '../../components/student/home/GuidedTourStudentHomePageWidget';

interface IStudentHomePageProps {
  match: IMatchProps;
  favoriteInterests: { interestID: string, count, number }[];
}

const StudentHomePage: React.FC<IStudentHomePageProps> = ({ match, favoriteInterests }) => (
  <div id="student-home-page">
    <StudentPageMenuWidget />
    <GuidedTourStudentHomePageWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <StudentHomeBannersWidget />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={11}>
            <StudentHomeRecommendedWidget />
            <StudentHomeRadGradVideosWidget />

          </Grid.Column>
          <Grid.Column width={5}>
            <StudentHomeNewOpportunitiesWidget />
            <Link to={buildExplorerRoute(match, EXPLORER_TYPE.OPPORTUNITIES)}>
              <u>More Opportunities</u>
            </Link>
            <StudentHomeFavoriteInterestsList favoriteInterests={favoriteInterests} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>

    <BackToTopButton />
  </div>

);

const countInArray = (array, value) => array.reduce((n, x) => n + (x === value), 0);

export default withTracker(() => {
  const favoriteInterests = FavoriteInterests.findNonRetired({});
  const favIDs = _.map(favoriteInterests, (f) => f.interestID);
  const favInterestObjects = [];
  _.forEach(favIDs, (id) => {
    const count = countInArray(favIDs, id);
    favInterestObjects.push({ interestID: id, count });
  });
  const noDups = _.uniqBy(favInterestObjects, 'interestID');
  // Sort in descending order
  const sorted = _.sortBy(noDups, 'count');
  _.reverse(sorted);
  // Only get the first 10 items
  const highestTen = sorted.slice(0, 10);
  return {
    favoriteInterests: highestTen,
  };
})(StudentHomePage);
