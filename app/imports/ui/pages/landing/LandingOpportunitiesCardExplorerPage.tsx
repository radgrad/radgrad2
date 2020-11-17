import React from 'react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { IOpportunity } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/explorer/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

interface IOpportunitiesCardExplorerProps {
  // eslint-disable-next-line react/no-unused-prop-types
  ready: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  opportunities: IOpportunity[];
  // eslint-disable-next-line react/no-unused-prop-types
  count: number;
  // eslint-disable-next-line react/no-unused-prop-types
  currentUser: string;
}

const renderPage = (props: IOpportunitiesCardExplorerProps) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div id="landing-opportunities-card-explorer-page">
      <ExplorerMenuBarContainer currentUser={props.currentUser} />
      <Grid stackable>
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
                <span>OPPORTUNITIES</span> ({props.count})
              </Header>
              <Card.Group stackable itemsPerRow={2} style={inlineStyle}>
                {props.opportunities.map((opportunity) => (
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

// eslint-disable-next-line react/prop-types
const LandingOpportunitiesCardExplorerPage = (props: IOpportunitiesCardExplorerProps) => ((props.ready) ? renderPage(props) : <Loader>Loading Opportunities</Loader>);

const LandingOpportunitiesCardExplorerCon = withRouter(LandingOpportunitiesCardExplorerPage);

const LandingOpportunitiesCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(Opportunities.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    opportunities: Opportunities.findNonRetired({}, { sort: { name: 1 } }),
    count: Opportunities.countNonRetired(),
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(LandingOpportunitiesCardExplorerCon);

export default LandingOpportunitiesCardExplorerContainer;
