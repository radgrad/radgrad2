import React from 'react';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Container, Segment, Form } from 'semantic-ui-react';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

interface IModerationQuestionCardWidget {
  question: any;
  handleAccept: (item, comments) => any;
  handleReject: (item, comments) => any;
}

interface IModerationQuestionCardWidgetState {
  moderatorComment: string
}

class ModerationQuestionCardWidget extends React.Component<IModerationQuestionCardWidget, IModerationQuestionCardWidgetState> {
  constructor(props) {
    super(props);
    this.state = { moderatorComment: '' };
  }

  private handleAcceptClick = () => {
    const update = this.props.handleAccept(this.props.question, this.state);
    this.setState({ moderatorComment: '' });
    console.log('handle accept click', update);
    updateMethod.call({ collectionName: update.collectionName, updateData: update.updateInfo }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  private handleChange = (event, { value }) => {
    this.setState({ moderatorComment: value });
  }


  private handleRejectClick = () => {
    const update = this.props.handleReject(this.props.question, this.state);
    this.setState({ moderatorComment: '' });
    console.log('handle accept click', update);
    updateMethod.call({ collectionName: update.collectionName, updateData: update.updateInfo }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  public render() {
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
      </Container>
    );
  }
}

export default withRouter(ModerationQuestionCardWidget);
