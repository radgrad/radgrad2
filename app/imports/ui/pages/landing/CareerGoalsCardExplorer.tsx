import * as React from 'react';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Card, Container, Grid, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerMenuBarContainer from '../../components/landing/ExplorerMenuBar';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';

interface ICareerGoalsCardExplorerProps {
  ready: boolean;
  careerGoals: object[];
  match: object;
  location: object;
  history: object;
}

class CareerGoalsCardExplorer extends React.Component<ICareerGoalsCardExplorerProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Loading Career Goals</Loader>;
  }

  private renderPage() {
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true} container={true}>
          <Grid.Row>
            <HelpPanelWidgetContainer routeProps={this.props.location}/>
          </Grid.Row>
        Career Goals Card Explorer
        </Grid>
      </div>
    );
  }
}

const CareerGoalsCardExplorerCon =  withRouter(CareerGoalsCardExplorer);

const CareerGoalsCardExplorerContainer = withTracker(() => {
  const subscription = Meteor.subscribe(CareerGoals.getCollectionName());
  return {
    ready: subscription.ready(),
    careerGoals: CareerGoals.find({}).fetch(),
  };
})(CareerGoalsCardExplorerCon);

export default CareerGoalsCardExplorerContainer;
