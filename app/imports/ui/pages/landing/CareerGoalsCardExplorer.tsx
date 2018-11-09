import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Card, Container, Grid, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerMenuBarContainer from '../../components/landing/ExplorerMenuBar';

interface ICareerGoalsCardExplorerProps {
  ready: boolean;
  careerGoals?: object[];
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
        Career Goals Card Explorer
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const CareerGoalsCardExplorerContainer = withTracker(() => {
  const handle = Meteor.subscribe(CareerGoals.getCollectionName());
  const ready = handle.ready();
  let careerGoals = [];
  if (ready) {
    careerGoals = CareerGoals.find({}).fetch();
  }
  return {
    ready,
    careerGoals,
  };
})(CareerGoalsCardExplorer);

export default CareerGoalsCardExplorerContainer;
