import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card } from 'semantic-ui-react';
import { Internships } from '../../../api/internship/InternshipCollection';
import { Internship } from '../../../typings/radgrad';
import LandingExplorerCard from '../../components/landing/explorer/LandingExplorerCard';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { EXPLORER_TYPE } from '../../utilities/ExplorerUtils';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

interface LandingInternshipsExplorerPageProps {
  internships: Internship[];
  count: number;
}

const headerPaneTitle = 'The Internship Explorer';
const headerPaneBody = `


This public explorer does not provide information about community members or the reviews associated with Internships.
`; // TODO: Internship Description
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
  const internships = Internships.findNonRetired();
  console.log(internships);
  const count = Internships.countNonRetired();
  return { internships, count };
})(LandingInternshipsExplorerPage);