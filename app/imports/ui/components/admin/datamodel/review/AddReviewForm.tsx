import React, { useState } from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, NumField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AcademicTerm, Course, Opportunity, StudentProfile } from '../../../../../typings/radgrad';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { academicTermToName, courseToName, docToName, profileToName } from '../../../shared/utilities/data-model';
import { Reviews } from '../../../../../api/review/ReviewCollection';

interface AddReviewFormProps {
  terms: AcademicTerm[];
  courses: Course[];
  students: StudentProfile[];
  opportunities: Opportunity[];
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ terms, formRef, handleAdd, courses, opportunities, students }) => {
  const [reviewType, setReviewType] = useState('');

  const handleModelChange = (model) => {
    // console.log('change %o', model);
    setReviewType(model.reviewType);
  };

  const termNames = _.map(terms, academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const courseNames = _.map(courses, courseToName);
  const opportunityNames = _.map(opportunities, docToName);
  const reviewTypes = [Reviews.COURSE, Reviews.OPPORTUNITY];
  let revieweeNames;
  if (reviewType === Reviews.COURSE) {
    revieweeNames = courseNames;
  } else {
    revieweeNames = opportunityNames;
  }
  const studentNames = _.map(students, profileToName);
  const schema = new SimpleSchema({
    slug: String,
    academicTerm: {
      type: String,
      allowedValues: termNames,
      defaultValue: currentTermName,
    },
    reviewee: {
      type: String,
      allowedValues: revieweeNames,
      defaultValue: revieweeNames[0],
    },
    student: {
      type: String,
      allowedValues: studentNames,
      defaultValue: studentNames[0],
    },
    reviewType: { type: String, allowedValues: reviewTypes, defaultValue: Reviews.COURSE },
    rating: { type: SimpleSchema.Integer, min: 0, max: 5, optional: true },
    comments: String,
    moderated: { type: Boolean, optional: true },
    visible: { type: Boolean, optional: true },
    moderatorComments: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  // @ts-ignore
  return (
    <Segment padded>
      <Header dividing>Add Review</Header>
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={formRef} showInlineError onChangeModel={handleModelChange}>
        <Form.Group widths="equal">
          <TextField name="slug" />
          <SelectField name="reviewType" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="student" />
          <SelectField name="reviewee" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="academicTerm" />
          <NumField name="rating" />
        </Form.Group>
        <LongTextField name="comments" />
        <Form.Group>
          <BoolField name="moderated" />
          <BoolField name="visible" />
        </Form.Group>
        <LongTextField name="moderatorComments" />
        <BoolField name="retired" />
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

export default AddReviewForm;
