import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import * as Router from '../../components/shared/utilities/router';
import { URL_ROLES } from '../../layouts/utilities/route-constants';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import CommunityUsersWidget from '../../components/shared/community-users/CommunityUsersWidget';
import CommunityFeedWidget from '../../components/shared/community-users/CommunityFeedWidget';
import { IMatchProps } from '../../components/shared/utilities/router';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface ICommunityUsersPageProps {
  match: IMatchProps;
}

const CommunityUsersPage = (props: ICommunityUsersPageProps) => {
  const { match } = props;
  const getMenuWidget = (): JSX.Element => {
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

  const menuWidget = getMenuWidget();
  return (
    <div id="community-users-page">
      {menuWidget}

      <Container>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={16}><HelpPanelWidget /></Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={5}>
              <CommunityFeedWidget />
            </Grid.Column>

            <Grid.Column width={11}>
              <CommunityUsersWidget />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <BackToTopButton />
    </div>
  );
};

export default CommunityUsersPage;
