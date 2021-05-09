import React from 'react';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Shinya's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const SandBoxShinyaPage: React.FC = () => (
  <PageLayout id="sandbox-onboard-shinya" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    Components go here.
  </PageLayout>
);

export default SandBoxShinyaPage;
