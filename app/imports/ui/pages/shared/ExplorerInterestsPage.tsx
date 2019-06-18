import * as React from 'react';
import { Container, Grid, Menu } from 'semantic-ui-react';
import ExplorerInterestsWidget from '../../components/shared/ExplorerInterestsWidget';
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
class ExplorerInterestsPage extends React.Component<IExplorerInterestsPageProps> {
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
      <div className='layout-page'>
        {this.renderPageMenuWidget()}
        <Grid celled>
          <Grid.Row>
            <Grid.Column>
              <Container>
                <Grid columns='equal'>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Menu fluid vertical tabular>
                        <Menu.Item name='my interests'></Menu.Item>
                        <Menu.Item name='my career goals'></Menu.Item>
                      </Menu>
                    </Grid.Column>
                    <Grid.Column>
                      <ExplorerInterestsWidget/>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const ExplorerInterestsPageCon = withGlobalSubscription(ExplorerInterestsPage);
const ExplorerInterestsPageContainer = withInstanceSubscriptions(ExplorerInterestsPageCon);

export default ExplorerInterestsPageContainer;
