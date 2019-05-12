import * as React from 'react';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IDesiredDegree } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';

interface IDegreesCardExplorerProps {
  ready: boolean;
  desiredDegrees: IDesiredDegree[];
  count: number;
  match: object;
  location: object;
  history: object;
}

class LandingDegreesCardExplorer extends React.Component<IDegreesCardExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Loading Degrees</Loader>;
  }

  private renderPage() {
    const inlineStyle = {
      maxHeight: 750,
      marginTop: 10,
    };
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true} container={true} padded="vertically">
          {/* <Grid.Row> */}
          {/* <HelpPanelWidgetContainer routeProps={this.props.location}/> */}
          {/* </Grid.Row> */}
          <Grid.Row>
            <Grid.Column width="three">
              <LandingExplorerMenuContainer/>
            </Grid.Column>
            <Grid.Column width="thirteen">
              <Segment padded={true} style={{ overflow: 'auto', maxHeight: 750 }}>
                <Header as="h4" dividing={true}>
                  <span>DESIRED DEGREES</span> ({this.props.count})
                </Header>
                <Card.Group stackable={true} itemsPerRow={2} style={inlineStyle}>
                  {this.props.desiredDegrees.map((goal) => (
                      <LandingExplorerCardContainer key={goal._id} type="degrees" item={goal}/>
                    ))}
                </Card.Group>
              </Segment>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

const LandingDegreesCardExplorerCon = withRouter(LandingDegreesCardExplorer);

const LandingDegreesCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(DesiredDegrees.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    desiredDegrees: DesiredDegrees.findNonRetired(),
    count: DesiredDegrees.countNonRetired(),
  };
})(LandingDegreesCardExplorerCon);

export default LandingDegreesCardExplorerContainer;
