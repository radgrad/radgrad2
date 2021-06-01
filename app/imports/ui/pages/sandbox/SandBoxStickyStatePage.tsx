import React from 'react';
import PageLayout from '../PageLayout';
import SandboxStickyState1 from './SandboxStickyState1';
import SandboxStickyState2 from './SandboxStickyState2';
import SandboxStickyState3 from './SandboxStickyState3';

const headerPaneTitle = 'SandBox: Sticky State';
const headerPaneBody = 'Example use of useStickyState (April, 2021)';
const headerPaneImage = 'images/header-panel/header-sandbox.png';

const SandBoxStickyStatePage: React.FC = () => (
  <PageLayout id="sandbox-sticky-state-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <SandboxStickyState1/>
    <SandboxStickyState2/>
    <SandboxStickyState3/>
  </PageLayout>
);

export default SandBoxStickyStatePage;
