import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, NumField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../../../../../api/base/BaseCollection';
import { Course, Interest } from '../../../../../typings/radgrad';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import PictureField from '../../../form-fields/PictureField';
import { docToName, interestIdToName } from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface UpdateCourseFormProps {
  collection: BaseCollection;
  interests: Interest[];
  courses: Course[];
  id: string;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateCourseForm: React.FC<UpdateCourseFormProps> = ({
  collection,
  courses,
  interests,
  id,
  handleCancel,
  handleUpdate,
  itemTitleString,
}) => {
  const model = collection.findDoc(id);
  const courseName = itemTitleString(model);
  model.interests = model.interestIDs.map(interestIdToName);
  const interestNames = interests.map(docToName);
  const schema = new SimpleSchema({
    name: { type: String, optional: true },
    shortName: { type: String, optional: true },
    creditHrs: {
      type: SimpleSchema.Integer,
      optional: true,
      min: 1,
      max: 15,
      defaultValue: 3,
    },
    num: { type: String, optional: true },
    picture: { type: String, optional: true },
    description: { type: String, optional: true },
    syllabus: { type: String, optional: true },
    interests: Array,
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    repeatable: { type: Boolean, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  // console.log(model, schema);
  return (
    <Segment padded>
      <Header dividing>
                Update  {collection.getType()}: {courseName}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={model}>
        <Form.Group widths="equal">
          <TextField name="name" />
          <TextField name="shortName" />
        </Form.Group>
        <Form.Group widths="equal">
          <NumField name="creditHrs" />
          <TextField name="num" />
        </Form.Group>
        <LongTextField name="description" />
        <MultiSelectField name="interests" />
        <PictureField name="picture" placeholder='https://mywebsite.com/picture.png' />
        <TextField name="syllabus" />
        <Form.Group>
          <BoolField name="repeatable" />
          <BoolField name="retired" />
        </Form.Group>
        <p />
        <SubmitField value="Update" disabled={false} className="mini basic green" />
        <Button onClick={handleCancel} basic color="green" size="mini">Cancel</Button>
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default UpdateCourseForm;
