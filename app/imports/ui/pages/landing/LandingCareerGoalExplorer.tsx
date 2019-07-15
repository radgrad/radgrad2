import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { ICareerGoal } from '../../../typings/radgrad'; // eslint-disable-line
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import withListSubscriptions from '../../layouts/shared/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import * as Router from '../../components/shared/RouterHelperFunctions';

interface ICareerGoalExplorerProps {
  careerGoal: ICareerGoal;
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

class LandingCareerGoalExplorer extends React.Component<ICareerGoalExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const { match } = this.props;
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
                  <span>{this.props.careerGoal.name}</span>
                </Header>
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.careerGoal.description}
                          renderers={{ link: (props) => Router.renderLink(props, match) }}/>
                <Header as="h4" dividing={true}>Career Goal Interests</Header>
                <LandingInterestList interestIDs={this.props.careerGoal.interestIDs}/>
              </Segment>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

const WithSubs = withListSubscriptions(LandingCareerGoalExplorer, [
  CareerGoals.getPublicationName(),
  Slugs.getPublicationName(),
  Interests.getPublicationName(),
]);

const LandingCareerGoalExplorerCon = withRouter(WithSubs);

const LandingCareerGoalExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.careergoal;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'CareerGoal');
  return {
    careerGoal: CareerGoals.findDoc(id),
  };
})(LandingCareerGoalExplorerCon);

export default LandingCareerGoalExplorerContainer;
