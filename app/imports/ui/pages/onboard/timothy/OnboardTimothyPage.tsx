import React from 'react';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Timothy's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardTimothyPage: React.FC = () => (
  <PageLayout id="sandbox-onboard-timothy" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    Components go here.
  </PageLayout>
);

export default OnboardTimothyPage;
