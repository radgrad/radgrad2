import React from 'react';
import { Grid, Container, Card } from 'semantic-ui-react';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import CardExplorerOpportunitiesWidget
  from '../../components/shared/explorer/opportunities-page/ExplorerOpportunitiesWidget';
import TeaserVideo from '../../components/shared/TeaserVideo';
import { radgradVideos } from '../../../api/radgrad/radgrad-videos';
import ExplorerSummerOpportunitiesWidget
  from '../../components/shared/explorer/opportunities-page/ExplorerSummerOpportunitiesWidget';
import ExplorerOpportunitiesHeaderWidget
  from '../../components/shared/explorer/opportunities-page/ExplorerOpportunitiesHeaderWidget';

const ExplorerOpportunitiesPage = () => {
  const opportunitiesVideoHeaderStyle: React.CSSProperties = {
    marginTop: '5px',
  };

  const opportunitiesInRadGradVideo: { title: string, youtubeID: string, author: string } = radgradVideos.filter((video) => video.title === 'Opportunities in RadGrad')[0];
  return (
    <div id="student-opportunities-page">
      <StudentPageMenuWidget />
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
