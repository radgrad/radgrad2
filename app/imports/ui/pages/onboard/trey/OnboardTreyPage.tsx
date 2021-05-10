import React from 'react';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Trey's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardTreyPage: React.FC = () => (
  <PageLayout id="sandbox-onboard-trey" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    Components go here.
  </PageLayout>
);

export default OnboardTreyPage;
