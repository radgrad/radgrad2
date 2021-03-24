import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, NumField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../../../../../api/base/BaseCollection';
import { Course, Interest } from '../../../../../typings/radgrad';
import { courseSlugToName, courseToName, docToName, interestIdToName } from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface UpdateCourseFormProps {
  collection: BaseCollection;
  interests: Interest[];
  courses: Course[];
  id: string;
  formRef: React.RefObject<unknown>;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateCourseForm: React.FC<UpdateCourseFormProps> = ({ collection, courses, interests, id, formRef, handleCancel, handleUpdate, itemTitleString }) => {
  const model = id ? collection.findDoc(id) : undefined;
  model.interests = model.interestIDs.map(interestIdToName);
  model.prerequisiteNames = model.prerequisites.map(courseSlugToName);
  const interestNames = interests.map(docToName);
  const courseNames = courses.map(courseToName);
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
    description: { type: String, optional: true },
    syllabus: { type: String, optional: true },
    interests: Array,
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    prerequisiteNames: { type: Array, optional: true },
    'prerequisiteNames.$': { type: String, allowedValues: courseNames },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  // console.log(model, schema);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {collection.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} ref={formRef} showInlineError model={model}>
        <Form.Group widths="equal">
          <TextField name="name" />
          <TextField name="shortName" />
        </Form.Group>
        <Form.Group widths="equal">
          <NumField name="creditHrs" />
          <TextField name="num" />
        </Form.Group>
        <LongTextField name="description" />
        <TextField name="syllabus" />
        <Form.Group widths="equal">
          <MultiSelectField name="interests" />
          <MultiSelectField name="prerequisiteNames" />
        </Form.Group>
        <BoolField name="retired" />
        <p />
        <SubmitField value="Update" disabled={false} />
        <Button onClick={handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateCourseForm;
