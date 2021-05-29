import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Interest } from '../../../../typings/radgrad';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';
import BrowserView from '../../../components/shared/explorer/browser-view/BrowserView';

interface InterestBrowserViewPageProps {
  interests: Interest[];
}

const headerPaneTitle = 'Find your interests';
const headerPaneBody = `
Interests specify disciplinary areas as well as other areas with a strong overlap.

Specify at least three interests so RadGrad can recommend related courses, opportunities, and community members.

If we've missed a disciplinary area of interest to you, please click the button below to ask a RadGrad administrator to add it to the system. 
`;
const headerPaneImage = 'header-interests.png';

const InterestBrowserViewPage: React.FC<InterestBrowserViewPageProps> = ({ interests }) => (
  <PageLayout id={PAGEIDS.INTEREST_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
    headerPaneImage={headerPaneImage}>
    <BrowserView items={interests} explorerType={EXPLORER_TYPE.INTERESTS} />
  </PageLayout>
);

export default withTracker(() => {
  const interests = Interests.findNonRetired({});
  return {
    interests,
  };
},
)(InterestBrowserViewPage);
