import { Meteor } from 'meteor/meteor';
import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { CareerGoal, HelpMessage } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import * as Router from '../../components/shared/utilities/router';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface CareerGoalExplorerProps {
  careerGoal: CareerGoal;
  helpMessages: HelpMessage[];
}

const LandingCareerGoalExplorerPage: React.FC<CareerGoalExplorerProps> = ({ careerGoal, helpMessages }) => {
  const match = useRouteMatch();
  return (
    <div id="landing-career-goal-explorer-page">
      <ExplorerMenuBarContainer />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>

        <Grid.Column width={1} />
        <Grid.Column width={3}>
          <LandingExplorerMenuContainer />
        </Grid.Column>

        <Grid.Column width={11}>
          <Segment padded style={{ overflow: 'auto', maxHeight: 750 }}>
            <Header as="h4" dividing>
              <span>{careerGoal.name}</span>
            </Header>
            <b>Description:</b>
            <Markdown
              escapeHtml
              source={careerGoal.description}
              renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
            />
            {careerGoal.interestIDs.length > 0 ?
              (<LandingInterestList interestIDs={careerGoal.interestIDs} />)
              : 'N/A'}
          </Segment>
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const WithSubs = withListSubscriptions(LandingCareerGoalExplorerPage, [
  CareerGoals.getPublicationName(),
  Slugs.getPublicationName(),
  Interests.getPublicationName(),
  HelpMessages.getPublicationName(),
]);

const LandingCareerGoalExplorerContainer = withTracker(() => {
  const { careergoal } = useParams();
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(careergoal, 'CareerGoal');
  return {
    careerGoal: CareerGoals.findDoc(id),
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(WithSubs);

export default LandingCareerGoalExplorerContainer;
