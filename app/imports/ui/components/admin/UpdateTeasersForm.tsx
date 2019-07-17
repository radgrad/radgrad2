import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicTerm, IInterest, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { docToName, interestIdToName, opportunityIdToName } from '../shared/AdminDataModelHelperFunctions';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import MultiSelectField from '../shared/MultiSelectField';

interface IUpdateTeaserFormProps {
  interests: IInterest[];
  opportunities: IOpportunity[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

class UpdateTeaserForm extends React.Component<IUpdateTeaserFormProps> {
  constructor(props) {
    super(props);
    // console.log('UpdateTeaserForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const model = this.props.collection.findDoc(this.props.id);
    model.opportunity = opportunityIdToName(model.opportunityID);
    model.interests = _.map(model.interestIDs, interestIdToName);
    const opportunityNames = _.map(this.props.opportunities, docToName);
    const interestNames = _.map(this.props.interests, docToName);
    const schema = new SimpleSchema({
      title: { type: String, optional: true },
      author: { type: String, optional: true },
      url: { type: String, optional: true },
      description: { type: String, optional: true },
      duration: { type: String, optional: true },
      interests: {
        type: Array,
        optional: true,
      },
      'interests.$': {
        type: String,
        allowedValues: interestNames,
      },
      opportunity: { type: String, allowedValues: opportunityNames, optional: true },
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleUpdate} ref={this.props.formRef}
                  showInlineError={true} model={model}>
          <Form.Group widths="equal">
            <TextField name="title"/>
            <TextField name="author"/>
          </Form.Group>
          <Form.Group widths="equal">
            <TextField name="url"/>
            <TextField name="duration"/>
          </Form.Group>
          <LongTextField name="description"/>
          <Form.Group widths="equal">
            <MultiSelectField name="interests"/>
            <SelectField name="opportunity"/>
          </Form.Group>
          <BoolField name="retired"/>
          <SubmitField/>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
        </AutoForm>
      </Segment>
    );
  }
}

const UpdateTeaserFormContainer = withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  return {
    interests,
    opportunities,
  };
})(UpdateTeaserForm);

export default UpdateTeaserFormContainer;
