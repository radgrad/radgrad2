import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { ICareerGoal } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/explorer/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

interface ICareerGoalsCardExplorerProps {
  // eslint-disable-next-line react/no-unused-prop-types
  ready: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  careerGoals: ICareerGoal[];
  // eslint-disable-next-line react/no-unused-prop-types
  count: number;
  // eslint-disable-next-line react/no-unused-prop-types
  currentUser: string;
}

const renderPage = (props: ICareerGoalsCardExplorerProps) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div id="landing-career-goals-card-explorer-page">
      <ExplorerMenuBarContainer currentUser={props.currentUser} />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
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
                <span>CAREER GOALS</span> ({props.count})
              </Header>
              <Card.Group stackable itemsPerRow={2} style={inlineStyle}>
                {props.careerGoals.map((goal) => (
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

// eslint-disable-next-line react/prop-types
const LandingCareerGoalsCardExplorerPage = (props: ICareerGoalsCardExplorerProps) => ((props.ready) ? renderPage(props) : <Loader>Loading Career Goals</Loader>);

const LandingCareerGoalsCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(CareerGoals.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    careerGoals: CareerGoals.findNonRetired({}),
    count: CareerGoals.countNonRetired(),
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(LandingCareerGoalsCardExplorerPage);

export default LandingCareerGoalsCardExplorerContainer;
