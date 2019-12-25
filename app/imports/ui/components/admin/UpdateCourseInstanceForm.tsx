import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, AutoField, BoolField, NumField, TextField, SubmitField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { IAcademicTerm } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { academicTermIdToName, academicTermToName } from '../shared/data-model-helper-functions';
import { iceSchema } from '../../../api/ice/IceProcessor';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';

interface IUpdateCourseInstanceFormProps {
  terms: IAcademicTerm[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateCourseInstanceForm = (props: IUpdateCourseInstanceFormProps) => {
  const model = props.collection.findDoc(props.id);
  model.academicTerm = academicTermIdToName(model.termID);
  model.creditHours = model.creditHrs;
  // console.log(model);
  const termNames = _.map(props.terms, academicTermToName);
  const schema = new SimpleSchema({
    academicTerm: {
      type: String,
      allowedValues: termNames,
    },
    ice: iceSchema,
    verified: { type: Boolean, optional: true },
    fromRegistrar: { type: Boolean, optional: true },
    creditHours: {
      type: SimpleSchema.Integer,
      optional: true,
    },
    grade: {
      type: String,
      allowedValues: CourseInstances.validGrades,
      optional: true,
    },
    note: { type: String, optional: true },
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
          <BoolField name="fromRegistrar" />
        </Form.Group>
        <Form.Group>
          <NumField name="creditHours" />
          <SelectField name="grade" />
          <TextField name="note" />
        </Form.Group>
        <BoolField name="retired" />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={props.handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

const UpdateCourseInstanceFormContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  return {
    terms,
  };
})(UpdateCourseInstanceForm);

export default UpdateCourseInstanceFormContainer;
