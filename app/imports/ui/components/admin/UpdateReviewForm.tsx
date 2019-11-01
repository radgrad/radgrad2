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
import { academicTermIdToName, academicTermToName } from '../shared/data-model-helper-functions';

interface IUpdateReviewFormProps {
  terms: IAcademicTerm[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateReviewForm = (props: IUpdateReviewFormProps) => {
  const model = props.collection.findDoc(props.id);
  model.academicTerm = academicTermIdToName(model.termID);
  const termNames = _.map(props.terms, academicTermToName);
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
      <Header dividing={true}>Update {props.collection.getType()}: {props.itemTitleString(model)}</Header>
      <AutoForm schema={schema} onSubmit={props.handleUpdate} ref={props.formRef}
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
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

const UpdateReviewFormContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  return {
    terms,
  };
})(UpdateReviewForm);

export default UpdateReviewFormContainer;
