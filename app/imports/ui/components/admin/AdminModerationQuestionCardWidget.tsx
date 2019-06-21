import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Divider, Segment } from 'semantic-ui-react';
import Form from "semantic-ui-react/dist/commonjs/collections/Form";

interface IAdminModerationQuestionCardWidget {
  question: any;
  handleAccept: (item) => any;
  handleReject: (item) => any
}

class AdminModerationQuestionCardWidget extends React.Component<IAdminModerationQuestionCardWidget> {
  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <Container textAlign='left'>
        <strong>Question: </strong> {this.props.question.question}
        <Segment>
          <Form>
            <Form.TextArea label='Moderator Comments'/>
            <Button className='ui basic green mini button' onClick={this.props.handleAccept}>ACCEPT</Button>
            <Button className='ui basic red mini button' onClick={this.props.handleReject}>REJECT</Button>
          </Form>
        </Segment>

      </Container>
    )
  }
}

export default withRouter(AdminModerationQuestionCardWidget);
