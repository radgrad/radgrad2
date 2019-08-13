import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IAcademicPlan } from '../../../typings/radgrad'; // eslint-disable-line
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import withListSubscriptions from '../../layouts/shared/SubscriptionListHOC';
import LandingAcademicPlanViewer from '../../components/landing/LandingAcademicPlanViewer';
import * as Router from '../../components/shared/RouterHelperFunctions';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface IAcademicPlanExplorerProps {
  plan: IAcademicPlan;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  location: object;
  history: object;
}

class LandingAcademicPlanExplorer extends React.Component<IAcademicPlanExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    // console.log(this.props.plan);
    const { match } = this.props;
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={14}><HelpPanelWidget/></Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={3}>
              <LandingExplorerMenuContainer/>
            </Grid.Column>

            <Grid.Column width={11}>
              <Segment padded={true} style={{ overflow: 'auto', maxHeight: 750 }}>
                <Header as="h4" dividing={true}>
                  <span>{this.props.plan.name}</span>
                </Header>
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.plan.description}
                          renderers={{ link: (props) => Router.renderLink(props, match) }}/>
                <hr/>
                <LandingAcademicPlanViewer plan={this.props.plan}/>
              </Segment>
            </Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>
        </Grid>

        <BackToTopButton/>
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
