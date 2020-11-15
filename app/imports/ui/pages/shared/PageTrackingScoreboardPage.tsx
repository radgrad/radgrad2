import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import * as Router from '../../components/shared/router-helper-functions';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import { URL_ROLES } from '../../../startup/client/route-constants';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import PageTrackingMenu from '../../components/shared/page-tracking/PageTrackingMenu';
import PageTrackingScoreboardWidget from '../../components/shared/page-tracking/PageTrackingScoreboardWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface IPageTrackingAnalysisPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const PageTrackingScoreboardPage = (props: IPageTrackingAnalysisPageProps) => {
  const renderPageMenuWidget = (): JSX.Element => {
    const role = Router.getRoleByUrl(props.match);
    switch (role) {
      case URL_ROLES.ADMIN:
        return <AdminPageMenuWidget />;
      case URL_ROLES.ADVISOR:
        return <AdvisorPageMenuWidget />;
      case URL_ROLES.FACULTY:
        return <FacultyPageMenuWidget />;
      case URL_ROLES.STUDENT:
        return <StudentPageMenuWidget />;
      default:
        console.error('renderPageMenuWidget(): Unable to render the correct menu widget for the current role');
        return undefined;
    }
  };

  return (
    <React.Fragment>
      {renderPageMenuWidget()}

      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
            <PageTrackingMenu type="scoreboard" />
          </Grid.Column>

          <Grid.Column width={11} stretched>
            <PageTrackingScoreboardWidget />
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </React.Fragment>
  );
};

export default PageTrackingScoreboardPage;
