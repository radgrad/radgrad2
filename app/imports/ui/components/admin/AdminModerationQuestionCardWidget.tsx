import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Divider, Segment } from 'semantic-ui-react';
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import { updateMethod } from "../../../api/base/BaseCollection.methods";
import Swal from "sweetalert2";

interface IAdminModerationQuestionCardWidget {
  question: any;
  handleAccept: (item, comments) => any;
  handleReject: (item, comments) => any
}
interface IAdminModerationQuestionCardWidgetState{
  moderatorComment: string
}

class AdminModerationQuestionCardWidget extends React.Component<IAdminModerationQuestionCardWidget, IAdminModerationQuestionCardWidgetState> {
  constructor(props) {
    super(props)
    this.state = { moderatorComment: ''}
  }

  private handleAcceptClick = () => {
    const update = this.props.handleAccept(this.props.question, this.state);
    this.setState({moderatorComment: ''});
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

  private handleChange = (event, { value }) => {
    this.setState({ moderatorComment: value });
  }

  private handleRejectClick = () => {
    const update = this.props.handleReject(this.props.question, this.state);
    this.setState({moderatorComment: ''});
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
            <Form.TextArea label='Moderator Comments' value={this.state.moderatorComment} onChange={this.handleChange}/>
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
