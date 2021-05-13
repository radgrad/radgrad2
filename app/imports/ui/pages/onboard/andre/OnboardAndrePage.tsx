import React from 'react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Andre's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardAndrePage: React.FC = () => (
  <PageLayout id={PAGEIDS.ONBOARD_ANDRE} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    Components go here.
  </PageLayout>
);

export default OnboardAndrePage;
