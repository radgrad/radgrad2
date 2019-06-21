import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Divider, Segment } from 'semantic-ui-react';
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import { updateMethod } from "../../../api/base/BaseCollection.methods";
import Swal from "sweetalert2";

interface IAdminModerationQuestionCardWidget {
  question: any;
  handleAccept: (item) => any;
  handleReject: (item) => any
}

class AdminModerationQuestionCardWidget extends React.Component<IAdminModerationQuestionCardWidget> {
  constructor(props) {
    super(props)
  }

  private handleAcceptClick = () => {
    const update = this.props.handleAccept(this.props.question);
    console.log('handle accept click', update);
    updateMethod.call({ collectionName: update.collectionName, updateData: update.updateInfo }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })
  }
  private handleRejectClick = () => {
    const update = this.props.handleReject(this.props.question);
    console.log('handle accept click', update);
    updateMethod.call({ collectionName: update.collectionName, updateData: update.updateInfo }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })
  }

  public render() {
    console.log(this.props.question)
    return (
      <Container textAlign='left'>
        <strong>Question: </strong> {this.props.question.question}
        <Segment>
          <Form>
            <Form.TextArea label='Moderator Comments'/>
            <Button className='ui basic green mini button' onClick={this.handleAcceptClick}>ACCEPT</Button>
            <Button className='ui basic red mini button' onClick={this.handleRejectClick}>REJECT</Button>
          </Form>
        </Segment>
        <Divider/>
      </Container>
    )
  }
}

export default withRouter(AdminModerationQuestionCardWidget);
