import * as React from 'react';
import { Container, Header } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import CommunityRadGradVideosWidget from '../../components/shared/Community/CommunityRadGradVideosWidget';

const CommunityRadGradVideosPage = () => (
  <>
    <StudentPageMenuWidget />
    <Container>
      <Header as="h1">RadGrad Videos</Header>
      <CommunityRadGradVideosWidget />
    </Container>
    <BackToTopButton />
  </>
);

export default CommunityRadGradVideosPage;
