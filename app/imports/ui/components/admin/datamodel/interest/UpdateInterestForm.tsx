import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField, ErrorsField, AutoField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { InterestKeywords } from '../../../../../api/interest/InterestKeywordCollection';
import { InterestTypes } from '../../../../../api/interest/InterestTypeCollection';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import PictureField from '../../../form-fields/PictureField';
import { docToName } from '../../../shared/utilities/data-model';
import { InterestType } from '../../../../../typings/radgrad';
import BaseCollection from '../../../../../api/base/BaseCollection';

interface UpdateInterestFormProps {
  interestTypes: InterestType[];
  collection: BaseCollection;
  id: string;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateInterestForm: React.FC<UpdateInterestFormProps> = ({
  interestTypes,
  collection,
  id,
  handleCancel,
  handleUpdate,
  itemTitleString,
}) => {
  const interestTypeNames = interestTypes.map(docToName);
  const model = collection.findDoc(id);
  model.interestType = InterestTypes.findDoc(model.interestTypeID).name;
  model.keywords = InterestKeywords.getKeywords(id);
  const schema = new SimpleSchema({
    name: { type: String, optional: true },
    picture: { type: String, optional: true },
    interestType: {
      type: String,
      allowedValues: interestTypeNames,
      defaultValue: interestTypeNames[0],
      optional: true,
    },
    description: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
    keywords: { type: Array, optional: true },
    'keywords.$': { type: String },
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
          <TextField name="name" />
          <SelectField name="interestType" />
        </Form.Group>
        <PictureField name="picture" placeholder='https://mywebsite.com/picture.png' />
        <LongTextField name="description" />
        <BoolField name="retired" />
        <AutoField name="keywords" />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="mini basic green" />
        <Button onClick={handleCancel} basic color="green" size="mini">Cancel</Button>
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default UpdateInterestForm;
