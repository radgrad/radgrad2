import React from 'react';
import { Grid, Container, Card } from 'semantic-ui-react';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import GuidedTourStudentOpportunities from '../landing/GuidedTourStudentOpportunities';
import CardExplorerOpportunitiesWidget
  from '../../components/shared/CardExplorerOpportunitiesPage/CardExplorerOpportunitiesWidget';
import TeaserVideo from '../../components/shared/TeaserVideo';
import { radgradVideos } from '../../../api/radgrad/radgrad-videos';
import CardExplorerSummerOpportunitiesWidget
  from '../../components/shared/CardExplorerOpportunitiesPage/CardExplorerSummerOpportunitiesWidget';

const CardExplorerOpportunitiesPage = () => {
  const opportunitiesVideoHeaderStyle: React.CSSProperties = {
    marginTop: '5px',
  };

  const opportunitiesInRadGradVideo: { title: string, youtubeID: string, author: string } = radgradVideos.filter((video) => video.title === 'Opportunities in RadGrad')[0];
  return (
    <>
      <StudentPageMenuWidget />
      <GuidedTourStudentOpportunities />
      <Container>
        <Grid stackable divided="vertically">
          <Grid.Row>
            <Grid.Column width={11}>
              <CardExplorerOpportunitiesWidget />
            </Grid.Column>
            <Grid.Column width={5}>
              <CardExplorerSummerOpportunitiesWidget />
              <Card fluid>
                <Card.Content>
                  <TeaserVideo id={opportunitiesInRadGradVideo.youtubeID} />
                  {/* TODO: Refactor to add RadGrad video details using a collection, see issue-281 and the FIGMA mockup */}
                  <Card.Header textAlign="left" style={opportunitiesVideoHeaderStyle}>
                    {opportunitiesInRadGradVideo.title}
                  </Card.Header>
                  <Card.Description>
                    {opportunitiesInRadGradVideo.author}
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <BackToTopButton />
      </Container>
    </>
  );
};

export default CardExplorerOpportunitiesPage;
