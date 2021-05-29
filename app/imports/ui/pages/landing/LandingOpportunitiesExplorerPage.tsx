import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Header, Segment } from 'semantic-ui-react';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Opportunity } from '../../../typings/radgrad';
import LandingExplorerCard from '../../components/landing/explorer/LandingExplorerCard';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

interface LandingOpportunitiesExplorerPageProps {
  opportunities: Opportunity[];
  count: number;
}

const headerPaneTitle = 'The Opportunity Explorer';
const headerPaneBody = `
Opportunities are extracurricular activities that relate to this discipline. They are curated by the faculty to ensure that each Opportunity provides an educationally enriching experience.  Registered users can access reviews of (re-occuring) Opportunities to learn about the experiences of previous students. Registered users can also build community by finding other users who are interested in this Opportunity.

This public explorer does not provide information about community members or the reviews associated with Opportunities.
`;

const LandingOpportunitiesExplorerPage: React.FC<LandingOpportunitiesExplorerPageProps> = ({ opportunities, count }) => (
  <div>
    <LandingExplorerMenuBar/>
    <PageLayout id={PAGEIDS.LANDING_OPPORTUNITIES_EXPLORER} headerPaneTitle={headerPaneTitle}
      headerPaneBody={headerPaneBody}>
      <Segment>
        <Header as="h4" dividing>
          <span>OPPORTUNITIES</span> ({count})
        </Header>
        <Card.Group stackable>
          {opportunities.map((opportunity) => (
            <LandingExplorerCard key={opportunity._id} type="opportunities" item={opportunity}/>
          ))}
        </Card.Group>
      </Segment>
    </PageLayout>
  </div>
);

const LandingOpportunitiesExplorerPageContainer = withTracker(() => ({
  opportunities: Opportunities.findNonRetired({}, { sort: { name: 1 } }),
  count: Opportunities.countNonRetired(),
}))(LandingOpportunitiesExplorerPage);

export default withListSubscriptions(LandingOpportunitiesExplorerPageContainer, [Opportunities.getPublicationName(), Slugs.getPublicationName()]);
