import * as React from 'react';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import { IOpportunity } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';

interface IOpportunitiesCardExplorerProps {
  ready: boolean;
  opportunities: IOpportunity[];
  count: number;
  match: object;
  location: object;
  history: object;
}

class LandingOpportunitiesCardExplorer extends React.Component<IOpportunitiesCardExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Loading Opportunities</Loader>;
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
          {/*<Grid.Row>*/}
          {/*<HelpPanelWidgetContainer routeProps={this.props.location}/>*/}
          {/*</Grid.Row>*/}
          <Grid.Row>
            <Grid.Column width="three">
              <LandingExplorerMenuContainer/>
            </Grid.Column>
            <Grid.Column width="thirteen">
              <Segment padded={true} style={{ overflow: 'auto', maxHeight: 750 }}>
                <Header as="h4" dividing={true}>
                  <span>OPPORTUNITIES</span> ({this.props.count})
                </Header>
                <Card.Group stackable={true} itemsPerRow={2} style={inlineStyle}>
                  {this.props.opportunities.map((opportunity) => {
                    return (
                      <LandingExplorerCardContainer key={opportunity._id} type="opportunities" item={opportunity}/>
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

const LandingOpportunitiesCardExplorerCon = withRouter(LandingOpportunitiesCardExplorer);

const LandingOpportunitiesCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(Opportunities.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    opportunities: Opportunities.findNonRetired({}, { sort: { name: 1 } }),
    count: Opportunities.countNonRetired(),
  };
})(LandingOpportunitiesCardExplorerCon);

export default LandingOpportunitiesCardExplorerContainer;
