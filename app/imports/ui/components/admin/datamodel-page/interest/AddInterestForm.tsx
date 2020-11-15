import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IInterestType } from '../../../../../typings/radgrad';
import { InterestTypes } from '../../../../../api/interest/InterestTypeCollection';
import { docToName } from '../../../shared/utilities/data-model';

interface IAddInterestFormProps {
  interestTypes: IInterestType[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddInterestForm = (props: IAddInterestFormProps): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined => {
  const interestTypeNames = _.map(props.interestTypes, docToName);
  const schema = new SimpleSchema({
    name: String,
    slug: String,
    interestType: { type: String, allowedValues: interestTypeNames, defaultValue: interestTypeNames[0] },
    description: String,
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Interest</Header>
      <AutoForm schema={formSchema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
        <Form.Group widths="equal">
          <TextField name="slug" placeholder="rust" />
          <TextField name="name" placeholder="Rust Programming Language" />
          <SelectField name="interestType" />
        </Form.Group>
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

const AddInterestFormContainer = withTracker(() => (
  { interestTypes: InterestTypes.find({}).fetch() }
))(AddInterestForm);

export default AddInterestFormContainer;
