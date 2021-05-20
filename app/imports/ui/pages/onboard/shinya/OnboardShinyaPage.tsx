import React from 'react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';


const headerPaneTitle = "Shinya's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';
const task1Header = <RadGradHeader title="TASK 1: HELLO WORLD" icon = "globe america"/>;

const OnboardShinyaPage: React.FC = () => (
  <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <RadGradSegment header= {task1Header}>
        Hello World
    </RadGradSegment>
  </PageLayout>
);

export default OnboardShinyaPage;
