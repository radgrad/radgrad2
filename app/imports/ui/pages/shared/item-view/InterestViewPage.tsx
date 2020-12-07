import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid } from 'semantic-ui-react';
import _ from 'lodash';
import {
  ICourse,
  IHelpMessage,
  IInterest,
  IOpportunity,
  IProfile,
} from '../../../../typings/radgrad';
import { getMenuWidget } from '../utilities/getMenuWidget';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import ExplorerMenu from '../../../components/shared/explorer/item-view/ExplorerMenu';
import ExplorerInterestWidget from '../../../components/shared/explorer/item-view/interest/ExplorerInterestWidget';

interface IInterestViewPageProps {
  courses: ICourse[];
  favoriteInterests: IInterest[];
  favoriteCareerGoalInterests: IInterest[];
  helpMessages: IHelpMessage[];
  interest: IInterest;
  opportunities: IOpportunity[];
  profile: IProfile;
}

const InterestViewPage: React.FC<IInterestViewPageProps> = ({ courses, favoriteCareerGoalInterests, favoriteInterests, helpMessages, interest, opportunities, profile }) => {
  const match = useRouteMatch();
  const menuAddedList = _.map(favoriteInterests, (item) => ({
    item, count: 1,
  }));
  const menuCareerList = _.map(favoriteCareerGoalInterests, (item) => ({
    item, count: 1,
  }));
  return (
    <div id="interest-view-page">
      {getMenuWidget(match)}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <ExplorerMenu menuAddedList={menuAddedList} type="interests" menuCareerList={menuCareerList} />
            </Grid.Column>
            <Grid.Column width={13}>
              <ExplorerInterestWidget profile={profile} interest={interest} opportunities={opportunities} courses={courses} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

const InterestViewPageContainer = withTracker(() => {
  const { interest, username } = useParams();
  const interestDoc = Interests.findDocBySlug(interest);
  const helpMessages = HelpMessages.findNonRetired({});
  const profile = Users.getProfile(username);
  const courses = Courses.findNonRetired({});
  const opportunities = Opportunities.findNonRetired({});
  const allInterests = Users.getInterestIDsByType(profile.userID);
  const favoriteInterests = _.map(allInterests[0], (id) => Interests.findDoc(id));
  const favoriteCareerGoalInterests = _.map(allInterests[1], (id) => Interests.findDoc(id));
  return {
    courses,
    favoriteCareerGoalInterests,
    favoriteInterests,
    helpMessages,
    interest: interestDoc,
    opportunities,
    profile,
  };
})(InterestViewPage);

export default InterestViewPageContainer;
