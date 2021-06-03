import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card } from 'semantic-ui-react';
import { Interest } from '../../../typings/radgrad';
import { Interests } from '../../../api/interest/InterestCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerCard from '../../components/landing/explorer/LandingExplorerCard';
import { EXPLORER_TYPE } from '../../utilities/ExplorerUtils';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

interface InterestsCardExplorerProps {
  interests: Interest[];
  count: number;
}

const headerPaneTitle = 'The Interest Explorer';
const headerPaneBody = `
Interests are curated by the faculty to provide information about topic areas important to the discipline and future career goals.  Interests are used by RadGrad to recommend courses and opportunities relevant to the user. Interests are also used to build community by allowing registered users to find others with matching interests.

This public explorer does not provide information about community members.
`;
const headerPaneImage = 'images/header-panel/header-interests.png';

const LandingInterestsExplorerPage: React.FC<InterestsCardExplorerProps> = ({ interests, count }) => (
  <div>
    <LandingExplorerMenuBar/>
    <PageLayout id={PAGEIDS.LANDING_INTERESTS_EXPLORER} headerPaneTitle={headerPaneTitle}  headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <RadGradSegment header={<RadGradHeader title="INTERESTS" count={count} dividing />}>
        <Card.Group stackable itemsPerRow={4} id="browserCardGroup" style={{ margin: '0px' }}>
          {interests.map((interest) => (
            <LandingExplorerCard key={interest._id} type={EXPLORER_TYPE.INTERESTS} item={interest}/>
          ))}
        </Card.Group>
      </RadGradSegment>
    </PageLayout>
  </div>
);

const LandingInterestsCardExplorerContainer = withTracker(() => {
  const interests = Interests.findNonRetired({});
  const count = Interests.countNonRetired();
  return {
    interests,
    count,
  };
})(LandingInterestsExplorerPage);

export default withListSubscriptions(LandingInterestsCardExplorerContainer, [
  Interests.getPublicationName(),
  Slugs.getPublicationName(),
]);
