//@qauchida
//05/20/19
//Faculty Widget that shows About Me information
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {_} from 'meteor/erasaur:meteor-lodash';
import {Container, Grid, Header, Label, Icon, Form, Button} from 'semantic-ui-react';
import {FacultyProfiles} from "../../../api/user/FacultyProfileCollection";

interface IFacultyPageAboutMeWidgetProps {
  match?: {
    params: {
      username: string;
    }
  }
}

class FacultyPageAboutMeWidget extends React.Component<IFacultyPageAboutMeWidgetProps> {
  public render() {
    const username = this.props.match.params.username;
    const faculty = FacultyProfiles.findDoc(username);
    console.log(faculty);

    return (
      <Container>
        <Grid celled>
          <Grid.Row>
            <Grid.Column>
              <Header as='h4'>Profile</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={2}>
              <Header as='h5'>Name</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              first and last name
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <Header as='h5'>Email</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              Put the Email Address Here
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={2}>
              <Header as='h5'>Interests</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Grid celled>
                <Grid.Row>
                  <Label as='a'>
                    <Icon name='star'> Interests</Icon>
                  </Label>
                  <Label as='a'>
                    <Icon name='star'> Interests</Icon>
                  </Label>
                  <Label as='a'>
                    <Icon name='star'> Interests</Icon>
                  </Label>
                </Grid.Row>
                <Grid.Row>
                  <a>Edit in Interest Explorer</a>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <Header as='h5'>Career Goals</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Grid celled>
                <Grid.Row>
                  <Label as='a'>
                    <Icon name='suitcase'> Career Goals</Icon>
                  </Label>
                  <Label as='a'>
                    <Icon name='suitcase'> Career Goals</Icon>
                  </Label>
                  <Label as='a'>
                    <Icon name='suitcase'> Career Goals</Icon>
                  </Label>
                </Grid.Row>
                <Grid.Row>
                  <a>Edit in Career Goal Explorer</a>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={2}>
              <Header as='h5'>Website</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Form>
                <Form.Field>
                  <input/>
                </Form.Field>
                <Button type='update'>Update</Button>
              </Form>
            </Grid.Column>
            <Grid.Column floated='left' width={2}>
              <Header as='h5'>Picture(<a>Upload</a>)</Header>
            </Grid.Column>
            <Grid.Column floated='left' width={6}>
              <Form>
                <Form.Field>
                  <input/>
                </Form.Field>
                <Button type='update'>Update</Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

    );
  }

}

export default withRouter(FacultyPageAboutMeWidget);
