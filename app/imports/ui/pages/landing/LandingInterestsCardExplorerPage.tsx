import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { IInterest } from '../../../typings/radgrad';
import { Interests } from '../../../api/interest/InterestCollection';
import LandingExplorerCardContainer from '../../components/landing/explorer/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

interface IInterestsCardExplorerProps {
  // eslint-disable-next-line react/no-unused-prop-types
  ready: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  interests: IInterest[];
  // eslint-disable-next-line react/no-unused-prop-types
  count: number;
  // eslint-disable-next-line react/no-unused-prop-types
  currentUser: string;
}

const renderPage = (props: IInterestsCardExplorerProps) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div id="landing-interests-card-explorer-page">
      <ExplorerMenuBarContainer currentUser={props.currentUser} />
      <Grid stackable container padded="vertically">
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
                <span>INTERESTS</span> ({props.count})
              </Header>
              <Card.Group stackable itemsPerRow={2} style={inlineStyle}>
                {props.interests.map((interest) => (
                  <LandingExplorerCardContainer key={interest._id} type="interests" item={interest} />
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
const LandingInterestsCardExplorerPage = (props: IInterestsCardExplorerProps) => ((props.ready) ? renderPage(props) : <Loader>Loading Interests</Loader>);

const LandingInterestsCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(Interests.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    interests: Interests.findNonRetired({}),
    count: Interests.countNonRetired(),
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(LandingInterestsCardExplorerPage);

export default LandingInterestsCardExplorerContainer;
