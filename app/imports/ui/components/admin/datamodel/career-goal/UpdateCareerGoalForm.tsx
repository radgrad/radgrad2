import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../../../../../api/base/BaseCollection';
import { Interest } from '../../../../../typings/radgrad';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import PictureField from '../../../form-fields/PictureField';
import { docToName, interestIdToName } from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface UpdateCareerGoalFormProps {
  collection: BaseCollection;
  interests: Interest[];
  id: string;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateCareerGoalForm: React.FC<UpdateCareerGoalFormProps> = ({
  collection,
  interests,
  id,
  handleCancel,
  handleUpdate,
  itemTitleString,
}) => {

  const model = id ? collection.findDoc(id) : undefined;
  model.interests = model.interestIDs.map(interestIdToName);
  const interestNames = interests.map(docToName);
  const schema = new SimpleSchema({
    name: String,
    description: String,
    interests: {
      type: Array,
    },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    retired: { type: Boolean, optional: true },
    picture: { type: String, optional: true, defaultValue: 'header-career.png' },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  // console.log(model, schema);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {collection.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={model}>
        <TextField name="name" />
        <LongTextField name="description" />
        <MultiSelectField name="interests" />
        <PictureField name="picture" placeholder='https://mywebsite.com/picture.png'/>
        <BoolField name="retired" />
        <p />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
        <SubmitField value="Update" disabled={false} className="mini basic green" />
        <Button onClick={handleCancel} basic color="green" size="mini">Cancel</Button>
      </AutoForm>
    </Segment>
  );

};

export default UpdateCareerGoalForm;
