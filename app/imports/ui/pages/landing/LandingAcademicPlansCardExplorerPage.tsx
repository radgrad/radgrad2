import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Segment } from 'semantic-ui-react';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { AcademicPlan, HelpMessage } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import LandingAcademicPlanCardContainer from '../../components/landing/explorer/LandingAcademicPlanCard';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';

interface AcademicPlansCardExplorerProps {
  academicPlans: AcademicPlan[];
  count: number;
  helpMessages: HelpMessage[];
}

const LandingAcademicPlansCardExplorerPage: React.FC<AcademicPlansCardExplorerProps> = ({ academicPlans, helpMessages, count }) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div id="landing-academic-plans-card-explorer-page">
      <LandingExplorerMenuBar />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
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
                <span>ACADEMIC PLANS</span> ({count})
              </Header>
              <Card.Group stackable itemsPerRow={2} style={inlineStyle}>
                {academicPlans.map((plan) => (
                  <LandingAcademicPlanCardContainer key={plan._id} plan={plan} />
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

const WithSubs = withListSubscriptions(LandingAcademicPlansCardExplorerPage, [
  AcademicPlans.getPublicationName(),
  Slugs.getPublicationName(),
  HelpMessages.getPublicationName(),
]);

const LandingAcademicPlansCardExplorerContainer = withTracker(() => ({
  academicPlans: AcademicPlans.findNonRetired({}, { $sort: { year: 1, name: 1 } }),
  count: AcademicPlans.countNonRetired(),
  currentUser: Meteor.user() ? Meteor.user().username : '',
  helpMessages: HelpMessages.findNonRetired({}),
}))(WithSubs);

export default LandingAcademicPlansCardExplorerContainer;
