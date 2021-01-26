import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Segment } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { HelpMessage, Opportunity } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/explorer/LandingExplorerCard';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';

interface OpportunitiesCardExplorerProps {
  opportunities: Opportunity[];
  count: number;
  helpMessages: HelpMessage[];
}

const LandingOpportunitiesCardExplorerPage: React.FC<OpportunitiesCardExplorerProps> = ({ opportunities, helpMessages, count }) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div id="landing-opportunities-card-explorer-page">
      <ExplorerMenuBarContainer />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}>
            <HelpPanelWidget helpMessages={helpMessages} />
          </Grid.Column>
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
                <span>OPPORTUNITIES</span> ({count})
              </Header>
              <Card.Group stackable itemsPerRow={2} style={inlineStyle}>
                {opportunities.map((opportunity) => (
                  <LandingExplorerCardContainer key={opportunity._id} type="opportunities" item={opportunity} />
                ))}
              </Card.Group>
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>
    </div>
  );
};

const LandingOpportunitiesCardExplorerContainer = withTracker(() => ({
  opportunities: Opportunities.findNonRetired({}, { sort: { name: 1 } }),
  count: Opportunities.countNonRetired(),
  helpMessages: HelpMessages.findNonRetired({}),
}))(LandingOpportunitiesCardExplorerPage);

export default withListSubscriptions(LandingOpportunitiesCardExplorerContainer, [Opportunities.getPublicationName(), HelpMessages.getPublicationName()]);
