import React from 'react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IAcademicPlan, IRadGradMatch } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { withListSubscriptions } from '../../layouts/shared/SubscriptionListHOC';
import LandingAcademicPlanViewer from '../../components/landing/LandingAcademicPlanViewer';
import * as Router from '../../components/shared/RouterHelperFunctions';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface IAcademicPlanExplorerProps {
  plan: IAcademicPlan;
  match: IRadGradMatch;
  location: object;
  history: object;
}

const LandingAcademicPlanExplorer = (props: IAcademicPlanExplorerProps) => {
  // console.log(props.plan);
  const { match } = props;
  return (
    <div>
      <ExplorerMenuBarContainer />
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

const WithSubs = withListSubscriptions(LandingAcademicPlanExplorer, [
  AcademicPlans.getPublicationName(),
  Slugs.getPublicationName(),
]);

const LandingAcademicPlanExplorerCon = withRouter(WithSubs);

const LandingAcademicPlanExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.plan;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'AcademicPlan');
  return {
    plan: AcademicPlans.findDoc(id),
  };
})(LandingAcademicPlanExplorerCon);

export default LandingAcademicPlanExplorerContainer;
