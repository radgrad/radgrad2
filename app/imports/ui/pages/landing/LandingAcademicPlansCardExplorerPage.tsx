import React from 'react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { IAcademicPlan } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import LandingAcademicPlanCardContainer from '../../components/landing/explorer/LandingAcademicPlanCard';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

interface IAcademicPlansCardExplorerProps {
  // eslint-disable-next-line react/no-unused-prop-types
  ready: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  academicPlans: IAcademicPlan[];
  // eslint-disable-next-line react/no-unused-prop-types
  count: number;
  // eslint-disable-next-line react/no-unused-prop-types
  currentUser: string;
}

const renderPage = (props: IAcademicPlansCardExplorerProps) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div id="landing-academic-plans-card-explorer-page">
      <LandingExplorerMenuBar currentUser={props.currentUser} />
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
                <span>ACADEMIC PLANS</span> ({props.count})
              </Header>
              <Card.Group stackable itemsPerRow={2} style={inlineStyle}>
                {props.academicPlans.map((plan) => (
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

// eslint-disable-next-line react/prop-types
const LandingAcademicPlansCardExplorerPage = (props: IAcademicPlansCardExplorerProps) => ((props.ready) ? renderPage(props) : <Loader>Loading Academic Plans</Loader>);

const LandingAcademicPlansCardExplorerCon = withRouter(LandingAcademicPlansCardExplorerPage);

const LandingAcademicPlansCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(AcademicPlans.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    academicPlans: AcademicPlans.findNonRetired({}, { $sort: { year: 1, name: 1 } }),
    count: AcademicPlans.countNonRetired(),
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(LandingAcademicPlansCardExplorerCon);

export default LandingAcademicPlansCardExplorerContainer;
