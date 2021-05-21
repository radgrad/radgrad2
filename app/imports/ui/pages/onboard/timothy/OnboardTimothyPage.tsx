import React from 'react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';

const headerPaneTitle = "Timothy's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardTimothyPage: React.FC = () => (
  <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
   <RadGradSegment header={<RadGradHeader title='TASK 1: HELLO WORLD' icon='globe americas'/>}>
   Hello World
   </RadGradSegment>
  </PageLayout>
);

export default OnboardTimothyPage;
