import React from 'react';
import { Header } from 'semantic-ui-react';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'What\'s happening in RadGrad?';
const headerPaneBody = `
Here are the latest updates in RadGrad, plus overviews of the RadGrad community.
`;
const headerPaneImage = 'header-community.png';


const CommunityPage: React.FC = () => (
  <PageLayout id="community-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <Header>Community Page Placeholder</Header>
  </PageLayout>
);

export default CommunityPage;
