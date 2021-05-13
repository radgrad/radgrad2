import React from 'react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Trey's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardTreyPage: React.FC = () => (
  <PageLayout id={PAGEIDS.ONBOARD_TREY} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    Components go here.
  </PageLayout>
);

export default OnboardTreyPage;
