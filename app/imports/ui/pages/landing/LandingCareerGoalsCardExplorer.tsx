import React from 'react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { ICareerGoal } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

interface ICareerGoalsCardExplorerProps {
  // eslint-disable-next-line react/no-unused-prop-types
  ready: boolean;
  careerGoals: ICareerGoal[];
  count: number;
}

const renderPage = (props: ICareerGoalsCardExplorerProps) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div>
      <ExplorerMenuBarContainer />
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
const LandingCareerGoalsCardExplorer = (props: ICareerGoalsCardExplorerProps) => ((props.ready) ? renderPage(props) : <Loader>Loading Career Goals</Loader>);

const LandingCareerGoalsCardExplorerCon = withRouter(LandingCareerGoalsCardExplorer);

const LandingCareerGoalsCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(CareerGoals.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    careerGoals: CareerGoals.findNonRetired({}),
    count: CareerGoals.countNonRetired(),
  };
})(LandingCareerGoalsCardExplorerCon);

export default LandingCareerGoalsCardExplorerContainer;
