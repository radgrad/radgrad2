import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicTerm } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { academicTermIdToName, academicTermToName } from '../shared/AdminDataModelHelperFunctions';

interface IUpdateReviewFormProps {
  terms: IAcademicTerm[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

class UpdateReviewForm extends React.Component<IUpdateReviewFormProps> {
  constructor(props) {
    super(props);
    // console.log('UpdateReviewForm props=%o', props);
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
      rating: { type: SimpleSchema.Integer, optional: true },
      comments: { type: String, optional: true },
      moderatorComments: { type: String, optional: true },
      moderated: { type: Boolean, optional: true },
      visible: { type: Boolean, optional: true },
      retired: { type: Boolean, optional: true },
    });
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {this.props.collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleUpdate} ref={this.props.formRef}
                  showInlineError={true} model={model}>
          <Form.Group widths="equal">
            <SelectField name="academicTerm"/>
            <NumField name="rating"/>
          </Form.Group>
          <LongTextField name="comments"/>
          <LongTextField name="moderatorComments"/>
          <Form.Group widths="equal">
            <BoolField name="moderated"/>
            <BoolField name="visible"/>
            <BoolField name="retired"/>
          </Form.Group>
          <SubmitField/>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
        </AutoForm>
      </Segment>
    );
  }
}

const UpdateReviewFormContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  return {
    terms,
  };
})(UpdateReviewForm);

export default UpdateReviewFormContainer;
