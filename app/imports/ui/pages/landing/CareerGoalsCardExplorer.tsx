import * as React from 'react';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Card, Container, Grid, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerMenuBarContainer from '../../components/landing/ExplorerMenuBar';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import { ICareerGoal } from '../../../typings/radgrad';

interface ICareerGoalsCardExplorerProps {
  ready: boolean;
  careerGoals: ICareerGoal[];
  count: number;
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
    const inlineStyle = {
      maxHeight: 750,
      marginTop: 10,
    };
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true} container={true}>
          <Grid.Row>
            <HelpPanelWidgetContainer routeProps={this.props.location}/>
          </Grid.Row>
          <Segment padded={true}>
            <Header as="h4" dividing={true}>
              <span>CAREER GOALS</span> ({this.props.count})
            </Header>
            <Card.Group stackable={true} itemsPerRow={2} style={inlineStyle}>
              {this.props.careerGoals.map((goal) => {
                return (
                  <Card key={goal._id}>{goal.name}</Card>
                );
              })}
            </Card.Group>
          </Segment>

        </Grid>
      </div>
    );
  }
}

const CareerGoalsCardExplorerCon = withRouter(CareerGoalsCardExplorer);

const CareerGoalsCardExplorerContainer = withTracker(() => {
  const subscription = Meteor.subscribe(CareerGoals.getCollectionName());
  return {
    ready: subscription.ready(),
    careerGoals: CareerGoals.find({}).fetch(),
    count: CareerGoals.find().count(),
  };
})(CareerGoalsCardExplorerCon);

export default CareerGoalsCardExplorerContainer;
