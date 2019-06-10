import * as React from 'react';
import { Grid, Header, Image, Item, Modal } from 'semantic-ui-react';
import * as _ from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { Users } from '../../../api/user/UserCollection';

interface IStudentFeedModalProps {
  feed: object;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class StudentFeedModal extends React.Component<IStudentFeedModalProps> {
  constructor(props) {
    super(props);
  }

  private students = (feed) => {
    const students = [];
    _.forEach(feed.userIDs, (userID) => {
      students.push(Users.getProfile(userID));
    });
    return students;
  }

  private getFullName = (student) => {
    if (student.username === '') {
      return student.username;
    }
    return Users.getFullName(student.username);
  }

  private buildExplorerUsersRoute = () => {
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/`;
    return `${baseRoute}explorer/users`;
  }

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const students = this.students(this.props.feed);

    return (
      <React.Fragment>
        <Modal
          trigger={<a>View all users</a>}
          size="small"
          closeIcon={true}
        >
          <Header size="small">STUDENTS</Header>
          <Modal.Content>
            <Grid columns={3}>
              {
                students.map((student, index) => (
                  <Grid.Column key={index}>
                    <Item.Group>
                      <Item>
                        <Image avatar={true} src={student.picture}/>
                        <Modal.Content>
                          <Link to={this.buildExplorerUsersRoute()}>
                            {this.getFullName(student)}
                          </Link>
                        </Modal.Content>
                      </Item>
                    </Item.Group>
                  </Grid.Column>
                ))
              }
            </Grid>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(StudentFeedModal);
