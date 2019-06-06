import * as React from 'react';
import {Container, Header} from 'semantic-ui-react';
import ExplorerInterestsWidget from "../../components/shared/ExplorerInterestsWidget";
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';

interface IExplorerInterestsPageProps {
  match: {
    isExact: boolean,
    path: string,
    url: string,
    params: {
      username: string;
      interest: string;
    }
  }
}

/**
 * written @gian
 */
class ExplorerInterestsPage extends React.Component<IExplorerInterestsPageProps>{
  constructor(props) {
    super(props);
  }

  private getRoleByUrl = () => {
    const url = this.props.match.url;
    const username = this.props.match.params.username;
    const indexUsername = url.indexOf(username);
    return url.substring(1, indexUsername - 1);
  }

  private renderPageMenuWidget = () => {
    const role = this.getRoleByUrl();
    switch (role) {
      case 'student':
        return <StudentPageMenuWidget/>;
      case 'mentor':
        return <MentorPageMenuWidget/>;
      case 'faculty':
        return <FacultyPageMenuWidget/>;
      default:
        return '';
    }
  }

  public render() {
    return (
      <div>
        {this.renderPageMenuWidget()}
          <ExplorerInterestsWidget/>
      </div>
    );
  }
}

const ExplorerInterestsPageCon = withGlobalSubscription(ExplorerInterestsPage);
const ExplorerInterestsPageContainer = withInstanceSubscriptions(ExplorerInterestsPageCon);

export default ExplorerInterestsPageContainer;
