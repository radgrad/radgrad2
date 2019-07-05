import * as React from 'react';
import { Container, Header, Grid, Image, Popup, Divider, Segment } from 'semantic-ui-react';
import { IInterest, IProfile } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { StudentParticipations } from '../../../api/public-stats/StudentParticipationCollection';

interface IInterestedProfileWidgetProps {
  interest: IInterest;
  students: IProfile[];
  faculty: IProfile[];
  alumni: IProfile[];
  mentors: IProfile[];
}

class InterestedProfilesWidget extends React.Component<IInterestedProfileWidgetProps> {
  constructor(props) {
    super(props);
  }

  private numberStudents = (item) => {
    const participatingUsers = StudentParticipations.findDoc({ itemID: item._id });
    return participatingUsers.itemCount;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { interest, students, faculty, alumni, mentors } = this.props;
    const numberStudents = this.numberStudents(interest);
    return (
      <Grid>
        <Grid.Row centered>
          <Grid.Column>
            <Container fluid>
              <Segment>
                <Header as="h5" textAlign="center">STUDENTS <WidgetHeaderNumber inputValue={numberStudents}/></Header>
                <Divider/>
                <Container textAlign='center'>
                  <Image.Group size='mini'>
                    {students.map((student, index) => <Popup
                      key={index}
                      trigger={<Image src={student.picture} circular size='mini'/>}
                      content={`${student.firstName} ${student.lastName}`}
                    />)}
                  </Image.Group>
                </Container>
              </Segment>
            </Container>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Container fluid>
              <Segment>
                <Header as="h5" textAlign="center">FACULTY MEMBERS <WidgetHeaderNumber
                  inputValue={faculty.length}/></Header>
                <Divider/>
                <Container textAlign='center'>
                  <Image.Group size='mini'>
                    {faculty.map((fac, index) => <Popup
                      key={index}
                      trigger={<Image src={fac.picture} circular/>}
                      content={`${fac.firstName} ${fac.lastName}`}
                    />)}
                  </Image.Group>
                </Container>
              </Segment>
            </Container>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Container>
              <Segment>
                <Header as="h5" textAlign="center">ALUMNI <WidgetHeaderNumber inputValue={alumni.length}/></Header>
                <Divider/>
                <Container textAlign='center'>
                  <Image.Group size='mini'>
                    {alumni.map((alum, index) => <Popup
                      key={index}
                      trigger={<Image src={alum.picture} circular/>}
                      content={`${alum.firstName} ${alum.lastName}`}
                    />)}
                  </Image.Group>
                </Container>
              </Segment>
            </Container>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Container>
              <Segment>
                <Header as="h5" textAlign="center">MENTORS <WidgetHeaderNumber inputValue={mentors.length}/></Header>
                <Divider/>
                <Container textAlign='center'>
                  <Image.Group size='mini'>
                    {mentors.map((mentor, index) => <Popup
                      key={index}
                      trigger={<Image src={mentor.picture} circular/>}
                      content={`${mentor.firstName} ${mentor.lastName}`}
                    />)}
                  </Image.Group>
                </Container>
              </Segment>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default InterestedProfilesWidget;
