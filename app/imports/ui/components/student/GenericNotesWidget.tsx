import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Button, Container, Header, Message, Modal } from "semantic-ui-react";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import * as Router from '../shared/RouterHelperFunctions';
import { IGenericNoteInstance } from "../../../typings/radgrad";
import { GenericNoteInstances } from "../../../api/generic-note/GenericNoteInstanceCollection";

interface IGenericNoteInstancesWidgetProps{
  match: Router.IMatchProps;
  studentID: string;
  genericNotes: IGenericNoteInstance[];
}

interface IGenericNoteInstancesWidgetState {
  modalOpen: boolean;
}
//use Modal to make a pop-up window onClick for Create Note Button
class GenericNotesWidget extends React.Component <IGenericNoteInstancesWidgetProps, IGenericNoteInstancesWidgetState> {
  constructor(props){
    super(props);
    this.state={
      modalOpen: false
    }
  }

  handleOpen = () => { this.setState({modalOpen: true})  }

  handleClose = () => { this.setState({modalOpen: false})  }

  public render() {
    console.log(this.props, this.state);
    const hasNotes = false;
    return (
      <div>
        {hasNotes ? (<div>
          <Header>Your Notes Go Here</Header>
        </div>) : (<Message>
          <Message.Header>No Notes</Message.Header>
          <p>You can create notes by clicking the "Create Note" button</p>
          <Modal
            trigger={<Button onClick={this.handleOpen}>Create Note</Button>}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            basic
            size='small'
          >
            <Modal.Header>Generic Note Editor</Modal.Header>
            <Modal.Description>
              You can create new notes and edit existing ones here.
            </Modal.Description>
            <Modal.Actions>
              <Button color = 'red' onClick={this.handleClose} inverted>Exit Without Saving</Button>
            </Modal.Actions>
          </Modal>
        </Message>)}
      </div>
    );
  };
}

export default withRouter(withTracker((props)=> {
  const studentID = Router.getUserIdFromRoute(props.match);
  const genericNotes = GenericNoteInstances.findNonRetired({student: studentID});
  return{
    studentID,
    genericNotes,
  };
})(GenericNotesWidget));
