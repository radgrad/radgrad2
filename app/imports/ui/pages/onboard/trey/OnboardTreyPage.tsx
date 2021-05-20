import React from 'react';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Trey's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardTreyPage: React.FC = () => (
  <PageLayout id={PAGEIDS.ONBOARD_TREY} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <RadGradSegment header={<RadGradHeader title={'TASK 1: HELLO WORLD'} icon={'globe americas'} dividing={true}/>} children={'Hello World'}/>
  </PageLayout>
);

export default OnboardTreyPage;
