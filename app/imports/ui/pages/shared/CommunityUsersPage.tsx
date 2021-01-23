import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { Feeds } from '../../../api/feed/FeedCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { ROLE } from '../../../api/role/Role';
import { Users } from '../../../api/user/UserCollection';
import { AdvisorOrFacultyProfile, IFeed, HelpMessage, StudentProfile } from '../../../typings/radgrad';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import * as Router from '../../components/shared/utilities/router';
import { URL_ROLES } from '../../layouts/utilities/route-constants';
import StudentPageMenu from '../../components/student/StudentPageMenu';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import CommunityUsersWidget from '../../components/shared/community-users/CommunityUsersWidget';
import CommunityFeedWidget from '../../components/shared/community-users/CommunityFeedWidget';
import { isUrlRoleStudent } from '../../components/shared/utilities/router';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface CommunityUsersPageProps {
  feeds: IFeed[];
  advisors: AdvisorOrFacultyProfile[];
  faculty: AdvisorOrFacultyProfile[];
  students: StudentProfile[];
  helpMessages: HelpMessage[];
}

const CommunityUsersPage: React.FC<CommunityUsersPageProps> = ({ faculty, helpMessages, advisors, students, feeds }) => {
  const match = useRouteMatch();
  const getMenuWidget = (): JSX.Element => {
    const role = Router.getRoleByUrl(match);
    switch (role) {
      case URL_ROLES.STUDENT:
        return <StudentPageMenu />;
      case URL_ROLES.FACULTY:
        return <FacultyPageMenuWidget />;
      case URL_ROLES.ADVISOR:
        return <AdvisorPageMenuWidget />;
      default:
        return <React.Fragment />;
    }
  };

  const menuWidget = getMenuWidget();
  return (
    <div id="community-users-page">
      {menuWidget}

      <Container>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={5}>
              <CommunityFeedWidget feeds={feeds} />
            </Grid.Column>

            <Grid.Column width={11}>
              <CommunityUsersWidget
                advisors={advisors}
                faculty={faculty}
                students={students}
                loggedInRole={Router.getRoleByUrl(match)}
              />
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
