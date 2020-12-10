import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { IAcademicPlan, IHelpMessage } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import LandingAcademicPlanViewer from '../../components/landing/explorer/LandingAcademicPlanViewer';
import * as Router from '../../components/shared/utilities/router';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface IAcademicPlanExplorerProps {
  plan: IAcademicPlan;
  helpMessages: IHelpMessage[];
}

const LandingAcademicPlanExplorerPage: React.FC<IAcademicPlanExplorerProps> = ({ plan, helpMessages }) => {
  // console.log(plan);
  const match = useRouteMatch();
  return (
    <div id="landing-academic-plan-explorer-page">
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
                <span>{plan.name}</span>
              </Header>
              <b>Description:</b>
              <Markdown
                escapeHtml
                source={plan.description}
                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
              />
              <hr />
              <LandingAcademicPlanViewer plan={plan} />
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const LandingAcademicPlanExplorerContainer = withTracker(() => {
  const { plan } = useParams();
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(plan, 'AcademicPlan');
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    plan: AcademicPlans.findDoc(id),
    helpMessages,
  };
})(LandingAcademicPlanExplorerPage);

export default withListSubscriptions(LandingAcademicPlanExplorerContainer, [
  AcademicPlans.getPublicationName(),
  Slugs.getPublicationName(),
]);
