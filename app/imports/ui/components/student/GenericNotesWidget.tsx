import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Button, Container, Header, Message } from "semantic-ui-react";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import * as Router from '../shared/RouterHelperFunctions';
import { IGenericNoteInstance } from "../../../typings/radgrad";
import { GenericNoteInstances } from "../../../api/generic-note/GenericNoteInstanceCollection";

interface IGenericNoteInstancesWidgetProps{
  match: Router.IMatchProps;
  studentID: string;
  genericNotes: IGenericNoteInstance[];
}
const createNote = () => {
  console.log('creating new note');
// https://blog.scottlogic.com/2019/10/29/popout-windows-in-react.html 
}

const GenericNotesWidget = (props: IGenericNoteInstancesWidgetProps) =>{
  console.log(props);
  const hasNotes = props.genericNotes.length >0;
  return(
    <div>
      {hasNotes ? ( <div>
        <Header>Your Notes Go Here</Header>
      </div>) : (<Message>
        <Message.Header>No Notes</Message.Header>
        <p>You can create notes by clicking the "Create Note" button</p>
      </Message>)}
      <Button onClick={this.createNote()}><Icon name="plus circle"/>Create Note</Button>
    </div>
  );
};

export default withRouter(withTracker((props)=> {
  const studentID = Router.getUserIdFromRoute(props.match);
  const genericNotes = GenericNoteInstances.findNonRetired({student: studentID});
  return{
    studentID,
    genericNotes,
  };
})(GenericNotesWidget));
