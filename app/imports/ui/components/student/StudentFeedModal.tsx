import * as React from 'react';
import { Grid, Header, Icon, Image, Item, Modal } from 'semantic-ui-react';
import { Users } from '../../../api/user/UserCollection';

interface IStudentFeedModalProps {
  feed: object;
}

class StudentFeedModal extends React.Component<IStudentFeedModalProps> {
  constructor(props) {
    super(props);
  }

  private students = (feed) => {
    const students = [];
    _.forEach(feed.userIDs, function (userID) {
      students.push(Users.getProfile(userID));
    });
    return students;
  }

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const students = this.students(this.props.feed);

    return (
      <React.Fragment>
        <Modal as="a">
          View all users
        </Modal>

        <Modal size="small">
          <Icon name="close"/>
          <Header size="small">STUDENTS</Header>
          <Modal.Content>
            <Grid columns={3}>
              {
                students.map((student, index) => (
                  <Grid.Column key={index}>
                    <Item.Group>
                      <Item>
                        {/* TODO: Height attribute */}
                        <Image avatar={true} src={student.picture}/>
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


export default StudentFeedModal;
