import * as React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import * as Router from '../../components/shared/RouterHelperFunctions';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import ScoreboardPageMenu from '../../components/shared/ScoreboardPageMenu';
import { IScoreboardPageProps } from './ScoreboardPage';

class CourseScoreboardPage extends React.Component<IScoreboardPageProps> {

  constructor(props) {
    super(props);
  }

  private getRoleByUrl = (): string => Router.getRoleByUrl(this.props.match);

  private renderPageMenuWidget = (): JSX.Element => {
    const role = this.getRoleByUrl();
    switch (role) {
      case 'advisor':
        return <AdvisorPageMenuWidget/>;
      case 'admin':
        return <AdminPageMenuWidget/>;
      case 'faculty':
        return <FacultyPageMenuWidget/>;
      default:
        return <React.Fragment/>;
    }
  };


}
