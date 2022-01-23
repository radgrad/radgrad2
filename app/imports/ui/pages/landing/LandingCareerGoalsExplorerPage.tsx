import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { CareerGoal } from '../../../typings/radgrad';
import LandingExplorerCard from '../../components/landing/explorer/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { EXPLORER_TYPE } from '../../utilities/ExplorerUtils';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

interface CareerGoalsExplorerProps {
  careerGoals: CareerGoal[];
  count: number;
}

const headerPaneTitle = 'The Career Goal Explorer';
const headerPaneBody = `
Career Goals are curated by the faculty to represent a good selection of the most promising career paths. Most career goals encompass several job titles. 

Registered users can add Career Goals to their profile which enables RadGrad to improve its ability to recommend extracurricular activities (called "Opportunities" in RadGrad). 

This page provides an overview of the Career Goals currently available in RadGrad. 
`;
const headerPaneImage = 'images/header-panel/header-career.png';

const LandingCareerGoalsExplorerPage: React.FC<CareerGoalsExplorerProps> = ({ count, careerGoals }) => (
  <div>
    <LandingExplorerMenuBar/>
    <PageLayout id={PAGEIDS.LANDING_CAREER_GOALS_EXPLORER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <RadGradSegment header={<RadGradHeader title="CAREER GOALS" count={count} dividing />}>
        <Card.Group stackable itemsPerRow={4} id="browserCardGroup" style={{ margin: '0px' }}>
          {careerGoals.map((goal) => (
            <LandingExplorerCard key={goal._id} type={EXPLORER_TYPE.CAREERGOALS} item={goal}/>
          ))}
        </Card.Group>
      </RadGradSegment>
    </PageLayout>
  </div>
);

const LandingCareerGoalsExplorerContainer = withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  const count = CareerGoals.countNonRetired();
  return {
    careerGoals,
    count,
  };
})(LandingCareerGoalsExplorerPage);

export default withListSubscriptions(LandingCareerGoalsExplorerContainer, [
  Interests.getPublicationName(),
  CareerGoals.getPublicationName(),
  Slugs.getPublicationName(),
]);
