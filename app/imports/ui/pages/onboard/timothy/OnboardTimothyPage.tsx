import React from 'react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Timothy's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardTimothyPage: React.FC = () => (
  <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    Components go here.
  </PageLayout>
);

export default OnboardTimothyPage;
