import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, NumField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AcademicTerm } from '../../../../../typings/radgrad';
import BaseCollection from '../../../../../api/base/BaseCollection';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import { academicTermIdToName, academicTermToName } from '../../../shared/utilities/data-model';

interface UpdateReviewFormProps {
  terms: AcademicTerm[];
  collection: BaseCollection;
  id: string;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateReviewForm: React.FC<UpdateReviewFormProps> = ({
  terms,
  collection,
  id,
  handleCancel,
  handleUpdate,
  itemTitleString,
}) => {
  // TODO why aren't we passed in the model/item?
  const model = collection.findDoc(id);
  model.academicTerm = academicTermIdToName(model.termID);
  const termNames = terms.map(academicTermToName);
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
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>
                Update
        {collection.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={model}>
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
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="mini basic green"/>
        <Button onClick={handleCancel} basic color="green" size="mini">Cancel</Button>
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default UpdateReviewForm;
