import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import * as Router from '../../components/shared/utilities/router';
import ExplorerNavDropdown from '../../components/shared/explorer/ExplorerNavDropdown';
import {
  PAGE_TRACKING_COMPARISON,
  PAGE_TRACKING_SCOREBOARD,
} from '../../layouts/utilities/route-constants';
import { PageInterestsCategoryTypes } from '../../../api/page-tracking/PageInterestsCategoryTypes';

interface IExplorerHomePageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const renderPageMenuWidget = (props: IExplorerHomePageProps): JSX.Element => {
  const role = Router.getRoleByUrl(props.match);
  switch (role) {
    case 'student':
      return <StudentPageMenuWidget />;
    case 'faculty':
      return <FacultyPageMenuWidget />;
    default:
      return <React.Fragment />;
  }
};

const ExplorerHomePage = (props: IExplorerHomePageProps) => (
  <div>
    {renderPageMenuWidget(props)}
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={3}>
          <ExplorerNavDropdown match={props.match} text="Select Explorer" />
        </Grid.Column>
        <Grid.Column width={11}>
          <Message>
            <Message.Header>
              MOST VIEWED CATEGORIES
            </Message.Header>
            Interested in seeing which areas of the different topic categories (Career Goals, Courses, Interests, and
            Opportunities) are visited the most? Go to the <b>Page Tracking Scoreboard Page</b> or <b>Comparison
              Page</b>!
            <p>
              <Link
                to={Router.buildRouteName(props.match, `/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.CAREERGOAL}`)}
              >
                Scoreboard Page
              </Link>
              : Sort and filter the number of views a student has visited that page for the different topic categories.
            </p>
            <p>
              <Link
                to={Router.buildRouteName(props.match, `/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.CAREERGOAL}`)}
              >
                Comparison Page
              </Link>
              : Pick out specific areas for a topic category to view the number of views a student has visited those
              particular pages.
            </p>
          </Message>
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>
  </div>
);

export default ExplorerHomePage;
