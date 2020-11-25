import { Meteor } from 'meteor/meteor';
import React from 'react';
import Markdown from 'react-markdown';
import { useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { IAcademicPlan } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';
import LandingAcademicPlanViewer from '../../components/landing/explorer/LandingAcademicPlanViewer';
import * as Router from '../../components/shared/utilities/router';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface IAcademicPlanExplorerProps {
  currentUser: string;
  plan: IAcademicPlan;
}

const LandingAcademicPlanExplorerPage = (props: IAcademicPlanExplorerProps) => {
  // console.log(props.plan);
  const match = useRouteMatch();
  return (
    <div id="landing-academic-plan-explorer-page">
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
                <span>{props.plan.name}</span>
              </Header>
              <b>Description:</b>
              <Markdown
                escapeHtml
                source={props.plan.description}
                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
              />
              <hr />
              <LandingAcademicPlanViewer plan={props.plan} />
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const WithSubs = withListSubscriptions(LandingAcademicPlanExplorerPage, [
  AcademicPlans.getPublicationName(),
  Slugs.getPublicationName(),
]);

const LandingAcademicPlanExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.plan;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'AcademicPlan');
  return {
    currentUser: Meteor.user() ? Meteor.user().username : '',
    plan: AcademicPlans.findDoc(id),
  };
})(WithSubs);

export default LandingAcademicPlanExplorerContainer;
