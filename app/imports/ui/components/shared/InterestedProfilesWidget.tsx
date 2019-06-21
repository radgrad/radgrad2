import * as React from 'react';
import { Container, Header, Grid, Image, Popup, Divider, Segment } from 'semantic-ui-react';
import { IProfile } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars

interface IInterestedProfileWidgetProps {
  students: IProfile[],
  faculty: IProfile[],
  alumni: IProfile[],
  mentors: IProfile[],
}

class InterestedProfilesWidget extends React.Component<IInterestedProfileWidgetProps> {
  constructor(props) {
    super(props);
    // console.log(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Grid>
        <Grid.Row centered>
          <Grid.Column>
            <Container fluid>
              <Segment>
                <Header textAlign='center'>Students <span
                  className='radgrad-header-number'>&middot; {this.props.students.length}</span></Header>
                <Divider/>
                <Container texcdtAlign='center'>
                  <Image.Group size='mini'>
                    {this.props.students.map((student, index) => <Popup
                      key={index}
                      trigger={<Image src={student.picture} circular size='mini'></Image>}
                      content={`${student.firstName} ${student.lastName}`}
                    />)
                    }
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
                <Header textAlign='center'>Faculty Members <span className='radgrad-header-number'>&middot;
                  {this.props.faculty.length}</span>
                </Header>
                <Divider/>
                <Container textAlign='center'>
                  <Image.Group size='mini'>
                    {this.props.faculty.map((faculty, index) => <Popup
                      key={index}
                      trigger={<Image src={faculty.picture} circular></Image>}
                      content={`${faculty.firstName} ${faculty.lastName}`}
                    />)
                    }
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
                <Header textAlign='center'>Alumni <span
                  className='radgrad-header-number'>&middot; {this.props.alumni.length}</span>
                </Header>
                <Divider/>
                <Container textAlign='center'>
                  <Image.Group size='mini'>
                    {this.props.alumni.map((alumni, index) => <Popup
                      key={index}
                      trigger={<Image src={alumni.picture} circular></Image>}
                      content={`${alumni.firstName} ${alumni.lastName}`}
                    />)
                    }
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
                <Header textAlign='center'>Mentors <span
                  className='radgrad-header-number'>&middot;  {this.props.mentors.length}</span>
                </Header>
                <Divider/>
                <Container textAlign='center'>
                  <Image.Group size='mini'>
                    {this.props.mentors.map((mentors, index) => <Popup
                      key={index}
                      trigger={<Image src={mentors.picture} circular></Image>}
                      content={`${mentors.firstName} ${mentors.lastName}`}
                    />)
                    }
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
