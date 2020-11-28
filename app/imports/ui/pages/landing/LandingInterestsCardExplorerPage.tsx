import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Segment } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { IHelpMessage, IInterest } from '../../../typings/radgrad';
import { Interests } from '../../../api/interest/InterestCollection';
import LandingExplorerCardContainer from '../../components/landing/explorer/LandingExplorerCard';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';

interface IInterestsCardExplorerProps {
  interests: IInterest[];
  count: number;
  helpMessages: IHelpMessage[];
}

const LandingInterestsCardExplorerPage = (props: IInterestsCardExplorerProps) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div id="landing-interests-card-explorer-page">
      <ExplorerMenuBarContainer />
      <Grid stackable container padded="vertically">
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget helpMessages={props.helpMessages} /></Grid.Column>
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

const WithSubs = withListSubscriptions(LandingInterestsCardExplorerPage, [
  Interests.getPublicationName(),
  HelpMessages.getPublicationName(),
]);

const LandingInterestsCardExplorerContainer = withTracker(() => ({
  interests: Interests.findNonRetired({}),
  count: Interests.countNonRetired(),
  helpMessages: HelpMessages.findNonRetired({}),
}))(WithSubs);

export default LandingInterestsCardExplorerContainer;
