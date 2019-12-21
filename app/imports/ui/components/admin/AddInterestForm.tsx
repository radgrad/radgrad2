import * as React from 'react';
import * as _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IInterestType } from '../../../typings/radgrad'; // eslint-disable-line
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { docToName } from '../shared/data-model-helper-functions';

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
  return (
    <Segment padded>
      <Header dividing>Add Interest</Header>
      <AutoForm schema={schema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
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
