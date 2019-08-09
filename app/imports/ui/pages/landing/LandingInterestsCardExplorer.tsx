import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IInterest } from '../../../typings/radgrad'; // eslint-disable-line
import { Interests } from '../../../api/interest/InterestCollection';
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

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
          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={14}><HelpPanelWidget/></Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={3}>
              <LandingExplorerMenuContainer/>
            </Grid.Column>

            <Grid.Column width={11}>
              <Segment padded={true} style={{ overflow: 'auto', maxHeight: 750 }}>
                <Header as="h4" dividing={true}>
                  <span>INTERESTS</span> ({this.props.count})
                </Header>
                <Card.Group stackable={true} itemsPerRow={2} style={inlineStyle}>
                  {this.props.interests.map((interest) => (
                    <LandingExplorerCardContainer key={interest._id} type="interests" item={interest}/>
                  ))}
                </Card.Group>
              </Segment>
            </Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>
        </Grid>

        <BackToTopButton/>
      </div>
    );
  }
}

const LandingInterestsCardExplorerCon = withRouter(LandingInterestsCardExplorer);

const LandingInterestsCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(Interests.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    interests: Interests.find({}).fetch(),
    count: Interests.find().count(),
  };
})(LandingInterestsCardExplorerCon);

export default LandingInterestsCardExplorerContainer;
