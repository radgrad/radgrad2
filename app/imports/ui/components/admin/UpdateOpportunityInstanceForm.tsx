import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import AutoField from 'uniforms-semantic/AutoField';
import BoolField from 'uniforms-semantic/BoolField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicTerm } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { academicTermIdToName, academicTermToName } from '../shared/AdminDataModelHelperFunctions';
import { iceSchema } from '../../../api/ice/IceProcessor';

interface IUpdateOpportunityInstanceFormProps {
  terms: IAcademicTerm[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

class UpdateOpportunityInstanceForm extends React.Component<IUpdateOpportunityInstanceFormProps> {
  constructor(props) {
    super(props);
    // console.log('UpdateOpportunityInstanceForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const model = this.props.collection.findDoc(this.props.id);
    model.academicTerm = academicTermIdToName(model.termID);
    const termNames = _.map(this.props.terms, academicTermToName);
    const schema = new SimpleSchema({
      academicTerm: {
        type: String,
        allowedValues: termNames,
      },
      verified: { type: Boolean, optional: true },
      ice: iceSchema,
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleUpdate} ref={this.props.formRef}
                  showInlineError={true} model={model}>
          <Form.Group widths="equal">
            <SelectField name="academicTerm"/>
            <AutoField name="ice"/>
          </Form.Group>
          <Form.Group widths="equal">
            <BoolField name="verified"/>
            <BoolField name="retired"/>
          </Form.Group>
          <SubmitField/>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
        </AutoForm>
      </Segment>
    );
  }
}

const UpdateOpportunityInstanceFormContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  return {
    terms,
  };
})(UpdateOpportunityInstanceForm);

export default UpdateOpportunityInstanceFormContainer;
