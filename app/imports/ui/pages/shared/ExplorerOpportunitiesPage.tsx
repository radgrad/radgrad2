import React from 'react';
import { Grid, Container, Card } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import CardExplorerOpportunitiesWidget
  from '../../components/shared/explorer/opportunities/ExplorerOpportunitiesWidget';
import TeaserVideo from '../../components/shared/TeaserVideo';
import { radgradVideos } from '../../../api/radgrad/radgrad-videos';
import ExplorerSummerOpportunitiesWidget
  from '../../components/shared/explorer/opportunities/ExplorerSummerOpportunitiesWidget';
import ExplorerOpportunitiesHeaderWidget
  from '../../components/shared/explorer/opportunities/ExplorerOpportunitiesHeaderWidget';
import * as Router from '../../components/shared/utilities/router';
import { URL_ROLES } from '../../layouts/utilities/route-constants';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';

const getMenuWidget = (match): JSX.Element => {
  const role = Router.getRoleByUrl(match);
  switch (role) {
    case URL_ROLES.STUDENT:
      return <StudentPageMenuWidget />;
    case URL_ROLES.FACULTY:
      return <FacultyPageMenuWidget />;
    case URL_ROLES.ADVISOR:
      return <AdvisorPageMenuWidget />;
    default:
      return <React.Fragment />;
  }
};

const ExplorerOpportunitiesPage: React.FC = () => {
  const opportunitiesVideoHeaderStyle: React.CSSProperties = {
    marginTop: '5px',
  };
  const match = useRouteMatch();
  const opportunitiesInRadGradVideo: { title: string, youtubeID: string, author: string } = radgradVideos.filter((video) => video.title === 'Opportunities in RadGrad')[0];
  return (
    <div id="student-opportunities-page">
      {getMenuWidget(match)}
      <ExplorerOpportunitiesHeaderWidget />
      <Container>
        <Grid stackable divided="vertically">
          <Grid.Row>
            <Grid.Column width={11}>
              <CardExplorerOpportunitiesWidget />
            </Grid.Column>
            <Grid.Column width={5}>
              <ExplorerSummerOpportunitiesWidget />
              <Card fluid>
                <Card.Content>
                  <TeaserVideo id={opportunitiesInRadGradVideo.youtubeID} />
                  {/* TODO: Refactor to add RadGrad video details using a collection, see issue-281 and the FIGMA mockup */}
                  <Card.Header textAlign="left" style={opportunitiesVideoHeaderStyle}>
                    {opportunitiesInRadGradVideo.title}
                  </Card.Header>
                  <Card.Description>
                    {opportunitiesInRadGradVideo.author}
                    {/*  TODO: Video Upload Date; see issue-281 and FIGMA mockup */}
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <BackToTopButton />
      </Container>
    </div>
  );
};

export default ExplorerOpportunitiesPage;
