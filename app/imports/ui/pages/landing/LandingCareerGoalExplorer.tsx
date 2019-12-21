import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { ICareerGoal, IRadGradMatch } from '../../../typings/radgrad'; // eslint-disable-line
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import withListSubscriptions from '../../layouts/shared/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import * as Router from '../../components/shared/RouterHelperFunctions';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface ICareerGoalExplorerProps {
  careerGoal: ICareerGoal;
  match: IRadGradMatch;
}

const LandingCareerGoalExplorer = (props: ICareerGoalExplorerProps) => {
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

        <Grid.Column width={1} />
        <Grid.Column width={3}>
          <LandingExplorerMenuContainer />
        </Grid.Column>

        <Grid.Column width={11}>
          <Segment padded style={{ overflow: 'auto', maxHeight: 750 }}>
            <Header as="h4" dividing>
              <span>{props.careerGoal.name}</span>
            </Header>
            <b>Description:</b>
            <Markdown
              escapeHtml
              source={props.careerGoal.description}
              renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
            />
            <Header as="h4" dividing>Career Goal Interests</Header>
            <LandingInterestList interestIDs={props.careerGoal.interestIDs} />
          </Segment>
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid>

      <BackToTopButton />
    </div>
  );
};

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
