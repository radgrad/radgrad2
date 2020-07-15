import * as React from 'react';
import { Container } from 'semantic-ui-react';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import CommunityRadGradVideosWidget from '../../components/shared/Community/CommunityRadGradVideosWidget';

const CommunityRadGradVideosPage = () => (
  <>
    <StudentPageMenuWidget />
    <Container>
      <CommunityRadGradVideosWidget />
    </Container>

    <BackToTopButton />
  </>
);

export default CommunityRadGradVideosPage;
