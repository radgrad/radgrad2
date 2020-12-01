import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import _ from 'lodash';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { IHelpMessage, IInterest } from '../../../../typings/radgrad';
import AdvisorPageMenuWidget from '../../../components/advisor/AdvisorPageMenuWidget';
import FacultyPageMenuWidget from '../../../components/faculty/FacultyPageMenuWidget';
import ExplorerMultipleItemsMenu from '../../../components/shared/explorer/browser-view/ExplorerMultipleItemsMenu';
import InterestBrowserViewContainer from '../../../components/shared/explorer/browser-view/InterestBrowserView';
import { IExplorerTypes } from '../../../components/shared/explorer/utilities/explorer';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import * as Router from '../../../components/shared/utilities/router';
import StudentPageMenuWidget from '../../../components/student/StudentPageMenuWidget';
import { EXPLORER_TYPE, URL_ROLES } from '../../../layouts/utilities/route-constants';

interface IInterestBrowserViewPageProps {
  favoriteInterests: IInterest[];
  favoriteCareerGoalInterests: IInterest[];
  interests: IInterest[];
  helpMessages: IHelpMessage[];
}

const getMenuWidget = (match): JSX.Element => {
  const role = Router.getRoleByUrl(match);
  switch (role) {
    case URL_ROLES.STUDENT:
      return <StudentPageMenuWidget />;
    case URL_ROLES.FACULTY:
      return <FacultyPageMenuWidget />;
    case URL_ROLES.ADVISOR:
      return <AdvisorPageMenuWidget />;
    default:
      return <React.Fragment />;
  }
};

const InterestBrowserViewPage: React.FC<IInterestBrowserViewPageProps> = ({ favoriteInterests, favoriteCareerGoalInterests, interests, helpMessages }) => {
  const match = useRouteMatch();
  const menuAddedItems = _.map(favoriteInterests, (doc) => ({ item: doc, count: 1 }));
  const menuCareerList = _.map(favoriteCareerGoalInterests, (doc) => ({ item: doc, count: 1 }));
  return (
    <div id="interest-browswer-view-page">
      {getMenuWidget(match)}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <ExplorerMultipleItemsMenu
                menuAddedList={menuAddedItems}
                type={EXPLORER_TYPE.INTERESTS as IExplorerTypes}
                menuCareerList={menuCareerList}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              <InterestBrowserViewContainer
                favoriteInterests={favoriteInterests}
                favoriteCareerGoalInterests={favoriteCareerGoalInterests}
                interests={interests}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  const allInterests = Users.getInterestIDsByType(profile.userID);
  const favoriteInterests = _.map(allInterests[0], (id) => Interests.findDoc(id));
  const favoriteCareerGoalInterests = _.map(allInterests[1], (id) => Interests.findDoc(id));
  const interests = Interests.findNonRetired({});
  const helpMessages = HelpMessages.findNonRetired({});

  return {
    favoriteCareerGoalInterests,
    favoriteInterests,
    helpMessages,
    interests,
  };
})(InterestBrowserViewPage);
