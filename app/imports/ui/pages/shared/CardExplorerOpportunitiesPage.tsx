import React from 'react';
import { Grid, Container, Image } from 'semantic-ui-react';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import GuidedTourStudentOpportunities from '../landing/GuidedTourStudentOpportunities';

const CardExplorerOpportunitiesPage = () => (
  <div>
    <StudentPageMenuWidget />
    <GuidedTourStudentOpportunities />
    <Container>
      <Grid stackable divided="vertically">

        <Grid.Row>
          <Grid.Column width={11}>
            opportunities
          </Grid.Column>
          <Grid.Column width={5}>
            <Image
              src="/images/banners/summer_internships.png"
            />
            opportunities for freshmen and
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </Container>
  </div>

);

export default CardExplorerOpportunitiesPage;
