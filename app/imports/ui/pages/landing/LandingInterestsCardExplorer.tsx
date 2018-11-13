import * as React from 'react';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import { IInterest } from '../../../typings/radgrad';
import { Interests } from '../../../api/interest/InterestCollection';
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';

interface IInterestsCardExplorerProps {
  ready: boolean;
  interests: IInterest[];
  count: number;
  match: object;
  location: object;
  history: object;
}

class LandingInterestsCardExplorer extends React.Component<IInterestsCardExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Loading Interests</Loader>;
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
                  <span>INTERESTS</span> ({this.props.count})
                </Header>
                <Card.Group stackable={true} itemsPerRow={2} style={inlineStyle}>
                  {this.props.interests.map((interest) => {
                    return (
                      <LandingExplorerCardContainer key={interest._id} type="interests" item={interest}/>
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

const LandingInterestsCardExplorerCon = withRouter(LandingInterestsCardExplorer);

const LandingInterestsCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(Interests.getCollectionName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    interests: Interests.find({}).fetch(),
    count: Interests.find().count(),
  };
})(LandingInterestsCardExplorerCon);

export default LandingInterestsCardExplorerContainer;
