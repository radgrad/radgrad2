import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IInterest, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import { docToName } from '../shared/AdminDataModelHelperFunctions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import MultiSelectField from '../shared/MultiSelectField';

interface IAddTeaserFormProps {
  interests: IInterest[];
  opportunities: IOpportunity[];
  formRef: any;
  handleAdd: (doc) => any;
}

class AddTeaserForm extends React.Component<IAddTeaserFormProps> {
  constructor(props) {
    super(props);
    // console.log('AddTeaserForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const opportunityNames = _.map(this.props.opportunities, docToName);
    const interestNames = _.map(this.props.interests, docToName);
    const schema = new SimpleSchema({
      slug: String,
      title: String,
      author: String,
      url: String,
      description: String,
      duration: String,
      interests: {
        type: Array,
      },
      'interests.$': {
        type: String,
        allowedValues: interestNames,
      },
      opportunity: { type: String, allowedValues: opportunityNames, defaultValue: opportunityNames[0] },
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add Teaser</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleAdd} ref={this.props.formRef} showInlineError={true}>
          <Form.Group widths="equal">
            <TextField name="slug"/>
            <TextField name="title"/>
          </Form.Group>
          <Form.Group widths="equal">
            <TextField name="author"/>
            <TextField name="url"/>
            <TextField name="duration"/>
          </Form.Group>
          <LongTextField name="description"/>
          <Form.Group widths="equal">
            <MultiSelectField name="interests"/>
            <SelectField name="opportunity"/>
          </Form.Group>
          <BoolField name="retired"/>
          <SubmitField className="basic green" value="Add"/>
        </AutoForm>
      </Segment>
    );
  }
}

const AddTeaserFormContainer = withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  return {
    interests,
    opportunities,
  };
})(AddTeaserForm);

export default AddTeaserFormContainer;
