import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';

const IndividualOpportunitiesPage = () => (
  <div>
    <StudentPageMenuWidget />
    <div className="gray-banner">aaa</div>
    <Container>
      <Grid stackable divided="vertically">

        <Grid.Row>
          <Grid.Column width={11}>
            opportunities
          </Grid.Column>
          <Grid.Column width={5}>
            opportunities for freshmen and
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </Container>
  </div>

);

export default IndividualOpportunitiesPage;
