import * as React from 'react';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import { IAcademicPlan } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import LandingAcademicPlanCardContainer from '../../components/landing/LandingAcademicPlanCard';

interface IAcademicPlansCardExplorerProps {
  ready: boolean;
  academicPlans: IAcademicPlan[];
  count: number;
  match: object;
  location: object;
  history: object;
}

class LandingAcademicPlansCardExplorer extends React.Component<IAcademicPlansCardExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Loading Academic Plans</Loader>;
  }

  private renderPage() {
    const inlineStyle = {
      maxHeight: 750,
      marginTop: 10,
    };
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true} container={true} padded="vertically">
          {/*<Grid.Row>*/}
          {/*<HelpPanelWidgetContainer routeProps={this.props.location}/>*/}
          {/*</Grid.Row>*/}
          <Grid.Row>
            <Grid.Column width="three">
              <LandingExplorerMenuContainer/>
            </Grid.Column>
            <Grid.Column width="thirteen">
              <Segment padded={true} style={{ overflow: 'auto', maxHeight: 750 }}>
                <Header as="h4" dividing={true}>
                  <span>ACADEMIC PLANS</span> ({this.props.count})
                </Header>
                <Card.Group stackable={true} itemsPerRow={2} style={inlineStyle}>
                  {this.props.academicPlans.map((plan) => {
                    return (
                      <LandingAcademicPlanCardContainer key={plan._id} plan={plan}/>
                    );
                  })}
                </Card.Group>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const LandingAcademicPlansCardExplorerCon = withRouter(LandingAcademicPlansCardExplorer);

const LandingAcademicPlansCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(AcademicPlans.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    academicPlans: AcademicPlans.find({}, { $sort: { year: 1, name: 1 } }).fetch(),
    count: AcademicPlans.find().count(),
  };
})(LandingAcademicPlansCardExplorerCon);

export default LandingAcademicPlansCardExplorerContainer;
