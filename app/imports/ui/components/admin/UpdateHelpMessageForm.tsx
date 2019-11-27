import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line

interface IUpdateHelpMessageFormProps {
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateHelpMessageForm = (props: IUpdateHelpMessageFormProps) => {
  const model = props.collection.findDoc(props.id);
  return (
    <Segment padded={true}>
      <Header dividing={true}>Update {props.collection.getType()}: {props.itemTitleString(model)}</Header>
      <AutoForm schema={HelpMessages.getUpdateSchema()} onSubmit={props.handleUpdate} ref={props.formRef}
                showInlineError={true} model={model}>
        <Form.Group widths="equal">
          <TextField name="routeName"/>
          <TextField name="title"/>
        </Form.Group>
        <LongTextField name="text"/>
        <BoolField name="retired"/>
        <SubmitField inputRef={undefined} value={'Update'} disabled={false} className={''}/>
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateHelpMessageForm;
