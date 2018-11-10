import * as React from 'react';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerMenuBarContainer from '../../components/landing/ExplorerMenuBar';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import { ICareerGoal } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';

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
          <Grid.Row>
            <Grid.Column width="three">
              <LandingExplorerMenuContainer/>
            </Grid.Column>
            <Grid.Column width="thirteen">
              <Segment padded={true} style={{ overflow: 'auto', maxHeight: 750 }}>
                <Header as="h4" dividing={true}>
                  <span>CAREER GOALS</span> ({this.props.count})
                </Header>
                <Card.Group stackable={true} itemsPerRow={2} style={inlineStyle}>
                  {this.props.careerGoals.map((goal) => {
                    return (
                      <LandingExplorerCardContainer key={goal._id} type="career-goals" item={goal}/>
                    );
                  })}
                </Card.Group>
              </Segment>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

const CareerGoalsCardExplorerCon = withRouter(CareerGoalsCardExplorer);

const CareerGoalsCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(CareerGoals.getCollectionName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    careerGoals: CareerGoals.find({}).fetch(),
    count: CareerGoals.find().count(),
  };
})(CareerGoalsCardExplorerCon);

export default CareerGoalsCardExplorerContainer;
