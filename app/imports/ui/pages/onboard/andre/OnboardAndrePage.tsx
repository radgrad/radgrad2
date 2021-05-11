import React from 'react';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Andre's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardAndrePage: React.FC = () => (
  <PageLayout id="sandbox-onboard-andre" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    Components go here.
  </PageLayout>
);

export default OnboardAndrePage;
