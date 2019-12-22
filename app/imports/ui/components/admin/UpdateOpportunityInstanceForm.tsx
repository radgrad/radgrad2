import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, AutoField, BoolField, SubmitField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import * as _ from 'lodash';
import { IAcademicTerm } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { academicTermIdToName, academicTermToName } from '../shared/data-model-helper-functions';
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

const UpdateOpportunityInstanceForm = (props: IUpdateOpportunityInstanceFormProps) => {
  const model = props.collection.findDoc(props.id);
  model.academicTerm = academicTermIdToName(model.termID);
  const termNames = _.map(props.terms, academicTermToName);
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
    <Segment padded>
      <Header dividing>
Update
        {props.collection.getType()}
:
        {props.itemTitleString(model)}
      </Header>
      <AutoForm
        schema={schema}
        onSubmit={props.handleUpdate}
        ref={props.formRef}
        showInlineError
        model={model}
      >
        <Form.Group widths="equal">
          <SelectField name="academicTerm" />
          <AutoField name="ice" />
        </Form.Group>
        <Form.Group widths="equal">
          <BoolField name="verified" />
          <BoolField name="retired" />
        </Form.Group>
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

const UpdateOpportunityInstanceFormContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  return {
    terms,
  };
})(UpdateOpportunityInstanceForm);

export default UpdateOpportunityInstanceFormContainer;
