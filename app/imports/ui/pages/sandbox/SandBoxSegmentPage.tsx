import React from 'react';
import PageLayout from '../PageLayout';
import SandboxSegment1 from './SandboxSegment1';
import SandboxSegment2 from './SandboxSegment2';
import SandboxSegment3 from './SandboxSegment3';
import SandboxSegment4 from './SandboxSegment4';
import SandboxSegment5 from './SandboxSegment5';

const headerPaneTitle = 'SandBox: Segment Design';
const headerPaneBody = 'Examples of RadGradSegment. (April, 2021)';
const headerPaneImage = 'images/header-panel/header-sandbox.png';

const SandBoxSegmentPage: React.FC = () => (
  <PageLayout id="sandbox-segment-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <SandboxSegment1/>
    <SandboxSegment2/>
    <SandboxSegment3/>
    <SandboxSegment4/>
    <SandboxSegment5/>
  </PageLayout>
);

export default SandBoxSegmentPage;
