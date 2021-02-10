import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';
import BackToTopButton from '../../app/imports/ui/components/shared/BackToTopButton';
import CommunityRadGradVideosWidget from './community-radgrad-videos/CommunityRadGradVideosWidget';
import { getMenuWidget } from '../../app/imports/ui/pages/shared/utilities/getMenuWidget';

const CommunityRadGradVideosPage: React.FC = () => {
  const match = useRouteMatch();
  const menuWidget = getMenuWidget(match);
  return (
    <div id="community-radgrad-videos-page">
      {menuWidget}

      <Container>
        <Header as="h1">RadGrad Videos</Header>
        <CommunityRadGradVideosWidget />
      </Container>
      <BackToTopButton />
    </div>
  );
};

export default CommunityRadGradVideosPage;
