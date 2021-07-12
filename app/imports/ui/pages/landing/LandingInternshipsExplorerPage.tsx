import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card } from 'semantic-ui-react';
import { Internships } from '../../../api/internship/InternshipCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Internship, Opportunity } from '../../../typings/radgrad';
import LandingExplorerCard from '../../components/landing/explorer/LandingExplorerCard';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { EXPLORER_TYPE } from '../../utilities/ExplorerUtils';
import { Interests } from '../../../api/interest/InterestCollection';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

interface LandingInternshipsExplorerPageProps {
  internships: Internship[];
  count: number;
}

const headerPaneTitle = 'The Internship Explorer';
const headerPaneBody = `
Opportunities are extracurricular activities that relate to this discipline. They are curated by the faculty to ensure that each Opportunity provides an educationally enriching experience.  Registered users can access reviews of (re-occuring) Opportunities to learn about the experiences of previous students. Registered users can also build community by finding other users who are interested in this Opportunity.

This public explorer does not provide information about community members or the reviews associated with Opportunities.
`;
const headerPaneImage = 'images/header-panel/header-opportunities.png';

const LandingInternshipsExplorerPage: React.FC<LandingInternshipsExplorerPageProps> = ({ internships, count }) => (
  <div>
    <LandingExplorerMenuBar/>
    <PageLayout id={PAGEIDS.LANDING_INTERNSHIPS_EXPLORER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <RadGradSegment header={<RadGradHeader title="INTERNSHIPS" count={count} dividing />}>
        <Card.Group stackable itemsPerRow={4} id="browserCardGroup" style={{ margin: '0px' }}>
          {internships.map((internship) => (
            <LandingExplorerCard key={internship._id} type={EXPLORER_TYPE.INTERNSHIPS} item={internship}/>
          ))}
        </Card.Group>
      </RadGradSegment>
    </PageLayout>
  </div>
);

export default withTracker(() => {
  const internships = Internships.findNonRetired({}, { sort: { name: 1 } });
  const count = Internships.countNonRetired();
  return { internships, count };
})(LandingInternshipsExplorerPage);