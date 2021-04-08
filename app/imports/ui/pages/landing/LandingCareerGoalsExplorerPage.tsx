import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Header, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { CareerGoal, HelpMessage } from '../../../typings/radgrad';
import LandingExplorerCard from '../../components/landing/explorer/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import PageLayout from '../PageLayout';

interface CareerGoalsExplorerProps {
  careerGoals: CareerGoal[];
  count: number;
  helpMessages: HelpMessage[];
}

const headerPaneTitle = 'The Career Goal Explorer';
const headerPaneBody = `
Career Goals are curated by the faculty to represent a good selection of the most promising career paths. Most career goals encompass several job titles. 

Registered users can add Career Goals to their profile which enables RadGrad to improve its ability to recommend extracurricular activities (called "Opportunities" in RadGrad). 

This page provides an overview of the Career Goals currently available in RadGrad. 
`;

const LandingCareerGoalsExplorerPage: React.FC<CareerGoalsExplorerProps> = ({ count, helpMessages, careerGoals }) => (
  <div>
    <LandingExplorerMenuBar/>
    <PageLayout id="landing-career-goals-explorer-page" headerPaneTitle={headerPaneTitle}
                headerPaneBody={headerPaneBody}>
      <Segment>
        <Header as="h4" dividing>
          <span>CAREER GOALS</span> ({count})
        </Header>
        <Card.Group stackable>
          {careerGoals.map((goal) => (
            <LandingExplorerCard key={goal._id} type="career-goals" item={goal}/>
          ))}
        </Card.Group>
      </Segment>
    </PageLayout>
  </div>
);

const LandingCareerGoalsExplorerContainer = withTracker(() => ({
  careerGoals: CareerGoals.findNonRetired({}),
  count: CareerGoals.countNonRetired(),
}))(LandingCareerGoalsExplorerPage);

export default withListSubscriptions(LandingCareerGoalsExplorerContainer, [CareerGoals.getPublicationName(), Slugs.getPublicationName(), Interests.getPublicationName()]);
