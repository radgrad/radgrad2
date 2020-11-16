import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, NumField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../../../../../api/base/BaseCollection';
import { ICourse, IInterest } from '../../../../../typings/radgrad';
import {
  courseSlugToName, courseToName,
  docToName,
  interestIdToName,
} from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface IUpdateCourseFormProps {
  collection: BaseCollection;
  interests: IInterest[];
  courses: ICourse[];
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateCourseForm = (props: IUpdateCourseFormProps) => {
  const model = props.id ? props.collection.findDoc(props.id) : undefined;
  model.interests = _.map(model.interestIDs, interestIdToName);
  model.prerequisiteNames = _.map(model.prerequisites, courseSlugToName);
  const interestNames = _.map(props.interests, docToName);
  const courseNames = _.map(props.courses, courseToName);
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
        {props.collection.getType()}
        :
        {props.itemTitleString(model)}
      </Header>
      <AutoForm
        schema={formSchema}
        onSubmit={props.handleUpdate}
        ref={props.formRef}
        showInlineError
        model={model}
      >
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
        <SubmitField className="" value="Update" disabled={false} inputRef={undefined} />
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateCourseForm;
