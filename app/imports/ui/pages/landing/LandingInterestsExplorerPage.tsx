import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Header, Segment } from 'semantic-ui-react';
import { Interest } from '../../../typings/radgrad';
import { Interests } from '../../../api/interest/InterestCollection';
import LandingExplorerCardContainer from '../../components/landing/explorer/LandingExplorerCard';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import PageLayout from '../PageLayout';
import { Slugs } from '../../../api/slug/SlugCollection';

interface InterestsCardExplorerProps {
  interests: Interest[];
  count: number;
}

const headerPaneTitle = 'The Interest Explorer';
const headerPaneBody = `
Interests are curated by the faculty to provide information about topic areas important to the discipline and future career goals.  Interests are used by RadGrad to recommend courses and opportunities relevant to the user. Interests are also used to build community by allowing registered users to find others with matching interests.

This public explorer does not provide information about community members.
`;

const LandingInterestsExplorerPage: React.FC<InterestsCardExplorerProps> = ({ interests, count }) => (
  <div>
    <LandingExplorerMenuBar/>
    <PageLayout id="landing-interests-card-explorer-page" headerPaneTitle={headerPaneTitle}
                headerPaneBody={headerPaneBody}>
      <Segment>
        <Header as="h4" dividing>
          <span>INTERESTS</span> ({count})
        </Header>
        <Card.Group stackable>
          {interests.map((interest) => (
            <LandingExplorerCardContainer key={interest._id} type="interests" item={interest}/>
          ))}
        </Card.Group>
      </Segment>
    </PageLayout>
  </div>
);

const LandingInterestsCardExplorerContainer = withTracker(() => ({
  interests: Interests.findNonRetired({}),
  count: Interests.countNonRetired(),
}))(LandingInterestsExplorerPage);

export default withListSubscriptions(LandingInterestsCardExplorerContainer, [Interests.getPublicationName(), Slugs.getPublicationName()]);
