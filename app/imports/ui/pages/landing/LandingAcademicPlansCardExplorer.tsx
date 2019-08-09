import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { IAcademicPlan } from '../../../typings/radgrad'; // eslint-disable-line
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import LandingAcademicPlanCardContainer from '../../components/landing/LandingAcademicPlanCard';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

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
                  <span>ACADEMIC PLANS</span> ({this.props.count})
                </Header>
                <Card.Group stackable={true} itemsPerRow={2} style={inlineStyle}>
                  {this.props.academicPlans.map((plan) => (
                    <LandingAcademicPlanCardContainer key={plan._id} plan={plan}/>
                  ))}
                </Card.Group>
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

const LandingAcademicPlansCardExplorerCon = withRouter(LandingAcademicPlansCardExplorer);

const LandingAcademicPlansCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(AcademicPlans.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    academicPlans: AcademicPlans.findNonRetired({}, { $sort: { year: 1, name: 1 } }),
    count: AcademicPlans.countNonRetired(),
  };
})(LandingAcademicPlansCardExplorerCon);

export default LandingAcademicPlansCardExplorerContainer;
