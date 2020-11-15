import React, { useState } from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, NumField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicTerm, ICourse, IOpportunity, IStudentProfile } from '../../../../../typings/radgrad';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../../../api/course/CourseCollection';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';
import { academicTermToName, courseToName, docToName, profileToName } from '../../../shared/data-model-helper-functions';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import { Reviews } from '../../../../../api/review/ReviewCollection';

interface IAddReviewFormProps {
  terms: IAcademicTerm[];
  courses: ICourse[];
  students: IStudentProfile[];
  opportunities: IOpportunity[];
  formRef: any;
  handleAdd: (doc) => any;
}

// interface IAddReviewFormState {
//   reviewType: string;
// }

const AddReviewForm = (props: IAddReviewFormProps) => {
  const [reviewType, setReviewType] = useState('');

  const handleModelChange = (model) => {
    // console.log('change %o', model);
    setReviewType(model.reviewType);
  };

  const termNames = _.map(props.terms, academicTermToName);
  const currentTermName = AcademicTerms.toString(AcademicTerms.getCurrentTermID(), false);
  const courseNames = _.map(props.courses, courseToName);
  const opportunityNames = _.map(props.opportunities, docToName);
  const reviewTypes = [Reviews.COURSE, Reviews.OPPORTUNITY];
  let revieweeNames;
  if (reviewType === Reviews.COURSE) {
    revieweeNames = courseNames;
  } else {
    revieweeNames = opportunityNames;
  }
  const studentNames = _.map(props.students, profileToName);
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
      <Header dividing>Add Course Instance</Header>
      <AutoForm
        schema={formSchema}
        onSubmit={props.handleAdd}
        ref={props.formRef}
        showInlineError
        onChangeModel={handleModelChange}
      >
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

const AddReviewFormContainer = withTracker(() => {
  const terms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const courses = Courses.find().fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1 } }).fetch();
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  return {
    terms,
    courses,
    students,
    opportunities,
  };
})(AddReviewForm);

export default AddReviewFormContainer;
