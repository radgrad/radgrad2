import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';

interface IUpdateMentorAnswerFormProps {
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateMentorAnswerForm = (props: IUpdateMentorAnswerFormProps) => {
  const model = props.collection.findDoc(props.id);
  return (
    <Segment padded={true}>
      <Header dividing={true}>Update {props.collection.getType()}: {props.itemTitleString(model)}</Header>
      <AutoForm schema={MentorAnswers.getUpdateSchema()} onSubmit={props.handleUpdate} ref={props.formRef}
                showInlineError={true} model={model}>
        <LongTextField name="text"/>
        <BoolField name="retired"/>
        <SubmitField inputRef={undefined} value={'Update'} disabled={false} className={''}/>
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateMentorAnswerForm;
