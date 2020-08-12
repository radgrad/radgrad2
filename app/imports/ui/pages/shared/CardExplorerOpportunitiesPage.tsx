import React from 'react';
import { Grid, Container, Card } from 'semantic-ui-react';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import GuidedTourStudentOpportunities from '../landing/GuidedTourStudentOpportunities';
import CardExplorerOpportunitiesWidget
  from '../../components/shared/CardExplorerOpportunitiesPage/CardExplorerOpportunitiesWidget';
import CardExplorerSummerOpportunitiesWidget from '../../components/shared/CardExplorerSummerOpportunitiesWidget';
import TeaserVideo from '../../components/shared/TeaserVideo';
import { radgradVideos } from '../../../api/radgrad/radgrad-videos';

const CardExplorerOpportunitiesPage = () => {
  const opportunitiesVideoHeaderStyle: React.CSSProperties = {
    marginTop: '5px',
  };

  const opportunitiesInRadGradVideoID: { title: string, youtubeID: string }[] = radgradVideos.filter((video) => video.title === 'Opportunities in RadGrad');
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
                  <TeaserVideo id={opportunitiesInRadGradVideoID[0].youtubeID} />
                  <Card.Header textAlign="center" style={opportunitiesVideoHeaderStyle}>Opportunities in RadGrad</Card.Header>
                  {/* TODO: RadGrad video details, see issue-281 and the FIGMA mockup */}
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
