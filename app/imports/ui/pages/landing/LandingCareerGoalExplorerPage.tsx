import React from 'react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { ICareerGoal } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import * as Router from '../../components/shared/utilities/router';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

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
}

const LandingCareerGoalExplorerPage = (props: ICareerGoalExplorerProps) => {
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
            {props.careerGoal.interestIDs.length > 0 ?
              (<LandingInterestList interestIDs={props.careerGoal.interestIDs} />)
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
