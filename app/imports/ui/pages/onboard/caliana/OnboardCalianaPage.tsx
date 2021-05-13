import React from 'react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Caliana's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardCalianaPage: React.FC = () => (
  <PageLayout id={PAGEIDS.ONBOARD_CALIANA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    Components go here.
  </PageLayout>
);

export default OnboardCalianaPage;
