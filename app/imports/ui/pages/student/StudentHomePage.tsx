import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import StudentHomeFavoriteInterestsList from '../../components/student/HomePage/StudentHomeFavoriteInterestsWidget';
import StudentHomeRecommendedWidget from '../../components/student/HomePage/StudentHomeRecommendedWidget';
import StudentHomeBannersWidget from '../../components/student/HomePage/StudentHomeBannersWidget';
import StudentHomeRadGradVideosWidget from '../../components/student/HomePage/StudentHomeRadGradVideosWidget';
import StudentHomeNewOpportunitiesWidget from '../../components/student/HomePage/StudentHomeNewOpportunitiesWidget';
import { buildExplorerRoute, IMatchProps } from '../../components/shared/RouterHelperFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import GuidedTourStudentHomePageWidget from '../../components/student/HomePage/GuidedTourStudentHomePageWidget';

interface IStudentHomePageProps {
  match: IMatchProps;
}

const StudentHomePage = (props: IStudentHomePageProps) => (
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
            <Link to={buildExplorerRoute(props.match, EXPLORER_TYPE.OPPORTUNITIES)}>
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
