import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Divider, Segment } from 'semantic-ui-react';
import Form from "semantic-ui-react/dist/commonjs/collections/Form";

interface IAdminModerationQuestionCardWidget {
  question: any;
  approve: (item) => any;
  deny: (item) => any
}

class AdminModerationQuestionCardWidget extends React.Component<IAdminModerationQuestionCardWidget> {
  constructor(props) {
    super(props)
    console.log('admin question card widget', props);
  }

  public render() {
    return (
      <Container textAlign='left'>
        <Divider/>

        <b>Question: </b> {this.props.question.question}

        <Segment>
          <Form>
            <Form.Field>
              <label>
                Moderator Comments:
              </label>
              <input/>
            </Form.Field>
          </Form>
          <Button.Group size='tiny'>
            <Button onClick={this.props.approve}>approve</Button>
            <Button onClick={this.props.deny}>deny</Button>
          </Button.Group>
        </Segment>

      </Container>
    )
  }
}

export default withRouter(AdminModerationQuestionCardWidget);
