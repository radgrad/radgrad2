import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IAcademicPlan } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import withListSubscriptions from '../../layouts/shared/SubscriptionListHOC';
import LandingAcademicPlanViewer from '../../components/landing/LandingAcademicPlanViewer';

interface IAcademicPlanExplorerProps {
  plan: IAcademicPlan;
  match: object;
  location: object;
  history: object;
}

class LandingAcademicPlanExplorer extends React.Component<IAcademicPlanExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    // console.log(this.props.plan);
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true} container={true} padded="vertically">
          {/* <Grid.Row> */}
          {/* <HelpPanelWidgetContainer routeProps={this.props.location}/> */}
          {/* </Grid.Row> */}
          <Grid.Row>
            <Grid.Column width="three">
              <LandingExplorerMenuContainer/>
            </Grid.Column>
            <Grid.Column width="thirteen">
              <Segment padded={true} style={{ overflow: 'auto', maxHeight: 750 }}>
                <Header as="h4" dividing={true}>
                  <span>{this.props.plan.name}</span>
                </Header>
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.plan.description}/>
                <hr/>
                <LandingAcademicPlanViewer plan={this.props.plan}/>
              </Segment>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

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
