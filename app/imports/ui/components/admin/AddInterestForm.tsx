import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'; // eslint-disable-line no-unused-vars
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
import { docToName } from '../shared/AdminDataModelHelperFunctions';

interface IAddInterestFormProps {
  interestTypes: IInterestType[];
  formRef: any;
  handleAdd: (doc) => any;
}

class AddInterestForm extends React.Component<IAddInterestFormProps> {
  constructor(props) {
    super(props);
    // console.log('AddInterestForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const interestTypeNames = _.map(this.props.interestTypes, docToName);
    const schema = new SimpleSchema({
      name: String,
      slug: String,
      interestType: { type: String, allowedValues: interestTypeNames, defaultValue: interestTypeNames[0] },
      description: String,
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add Interest</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleAdd} ref={this.props.formRef} showInlineError={true}>
          <Form.Group widths="equal">
            <TextField name="slug" placeholder="rust"/>
            <TextField name="name" placeholder="Rust Programming Language"/>
            <SelectField name="interestType"/>
          </Form.Group>
          <LongTextField name="description"/>
          <BoolField name="retired"/>
          <SubmitField className="basic green" value="Add"/>
        </AutoForm>
      </Segment>
    );
  }
}

const AddInterestFormContainer = withTracker(() => (
  { interestTypes: InterestTypes.find({}).fetch() }
))(AddInterestForm);

export default AddInterestFormContainer;
