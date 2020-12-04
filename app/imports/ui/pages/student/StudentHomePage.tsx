import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
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
}

const StudentHomePage: React.FC<IStudentHomePageProps> = ({ match }) => (
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
            <StudentHomeFavoriteInterestsList />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>

    <BackToTopButton />
  </div>

);

export default StudentHomePage;
