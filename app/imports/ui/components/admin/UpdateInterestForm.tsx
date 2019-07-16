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
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { docToName } from '../shared/AdminDataModelHelperFunctions';
import { IInterestType } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line

interface IUpdateInterestFormProps {
  interestTypes: IInterestType[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

class UpdateInterestForm extends React.Component<IUpdateInterestFormProps> {
  constructor(props) {
    super(props);
    // console.log('UpdateInterestForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const interestTypeNames = _.map(this.props.interestTypes, docToName);
    const model = this.props.collection.findDoc(this.props.id);
    model.slug = Slugs.getNameFromID(model.slugID);
    model.interestType = InterestTypes.findDoc(model.interestTypeID).name;
    const schema = new SimpleSchema({
      name: { type: String, optional: true },
      slug: { type: String, optional: true },
      interestType: { type: String, allowedValues: interestTypeNames, defaultValue: interestTypeNames[0], optional: true },
      description: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleUpdate} ref={this.props.formRef}
                  showInlineError={true} model={model}>
          <Form.Group widths="equal">
            <TextField name="slug" disabled={true}/>
            <TextField name="name"/>
            <SelectField name="interestType"/>
          </Form.Group>
          <LongTextField name="description"/>
          <BoolField name="retired"/>
          <SubmitField/>
        </AutoForm>
      </Segment>
    );
  }
}

const UpdateInterestFormContainer = withTracker(() => (
  { interestTypes: InterestTypes.find({}).fetch() }
))(UpdateInterestForm);

export default UpdateInterestFormContainer;
