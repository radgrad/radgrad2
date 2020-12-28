import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { CareerGoal, HelpMessage } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/explorer/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';

interface CareerGoalsCardExplorerProps {
  careerGoals: CareerGoal[];
  count: number;
  helpMessages: HelpMessage[];
}

const LandingCareerGoalsCardExplorerPage: React.FC<CareerGoalsCardExplorerProps> = ({ count, helpMessages, careerGoals }) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div id="landing-career-goals-card-explorer-page">
      <ExplorerMenuBarContainer />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
            <LandingExplorerMenuContainer />
          </Grid.Column>

          <Grid.Column width={11}>
            <Segment padded style={{ overflow: 'auto', maxHeight: 750 }}>
              <Header as="h4" dividing>
                <span>CAREER GOALS</span> ({count})
              </Header>
              <Card.Group stackable itemsPerRow={2} style={inlineStyle}>
                {careerGoals.map((goal) => (
                  <LandingExplorerCardContainer key={goal._id} type="career-goals" item={goal} />
                ))}
              </Card.Group>
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const LandingCareerGoalsCardExplorerContainer = withTracker(() => ({
  careerGoals: CareerGoals.findNonRetired({}),
  count: CareerGoals.countNonRetired(),
  helpMessages: HelpMessages.findNonRetired({}),
}))(LandingCareerGoalsCardExplorerPage);

export default withListSubscriptions(LandingCareerGoalsCardExplorerContainer, [
  CareerGoals.getPublicationName(),
  Slugs.getPublicationName(),
  Interests.getPublicationName(),
  HelpMessages.getPublicationName(),
]);
