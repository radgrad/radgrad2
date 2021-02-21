import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { Feeds } from '../../app/imports/api/feed/FeedCollection';
import { HelpMessages } from '../issue-392/help/HelpMessageCollection';
import { ROLE } from '../../app/imports/api/role/Role';
import { Users } from '../../app/imports/api/user/UserCollection';
import { AdvisorOrFacultyProfile, IFeed, HelpMessage, StudentProfile } from '../../app/imports/typings/radgrad';
import * as Router from '../../app/imports/ui/components/shared/utilities/router';
import HelpPanelWidget from '../issue-392/HelpPanelWidget';
import CommunityUsersWidget from './community-users/CommunityUsersWidget';
import CommunityFeedWidget from './community-users/CommunityFeedWidget';
import { isUrlRoleStudent } from '../../app/imports/ui/components/shared/utilities/router';
import BackToTopButton from '../../app/imports/ui/components/shared/BackToTopButton';
import { getMenuWidget } from '../../app/imports/ui/pages/shared/utilities/getMenuWidget';

interface CommunityUsersPageProps {
  feeds: IFeed[];
  advisors: AdvisorOrFacultyProfile[];
  faculty: AdvisorOrFacultyProfile[];
  students: StudentProfile[];
  helpMessages: HelpMessage[];
}

const CommunityUsersPage: React.FC<CommunityUsersPageProps> = ({ faculty, helpMessages, advisors, students, feeds }) => {
  const match = useRouteMatch();
  const menuWidget = getMenuWidget(match);
  return (
    <div id="community-users-page">
      {menuWidget}

      <Container>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={16}>
              <HelpPanelWidget helpMessages={helpMessages} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={5}>
              <CommunityFeedWidget feeds={feeds} />
            </Grid.Column>

            <Grid.Column width={11}>
              <CommunityUsersWidget advisors={advisors} faculty={faculty} students={students} loggedInRole={Router.getRoleByUrl(match)} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <BackToTopButton />
    </div>
  );
};

const CommunityUsersPageContainer = withTracker(() => {
  const match = useRouteMatch();
  const advisors = Users.findProfilesWithRole(ROLE.ADVISOR, {}, { sort: { lastName: 1 } });
  const faculty = Users.findProfilesWithRole(ROLE.FACULTY, {}, { sort: { lastName: 1 } });
  let students = Users.findProfilesWithRole(ROLE.STUDENT, {}, { sort: { lastName: 1 } });
  const helpMessages = HelpMessages.findNonRetired({});
  if (isUrlRoleStudent(match)) {
    students = _.filter(students, (s) => s.optedIn);
  }
  return {
    advisors,
    faculty,
    feeds: Feeds.findNonRetired({}, { sort: { timestamp: -1 } }),
    students,
    helpMessages,
  };
})(CommunityUsersPage);

export default CommunityUsersPageContainer;
