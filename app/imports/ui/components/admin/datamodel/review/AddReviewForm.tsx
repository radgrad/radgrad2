import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, NumField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import RadGradAlerts from '../../../../utilities/RadGradAlert';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { AcademicTerm, Course, Opportunity, StudentProfile } from '../../../../../typings/radgrad';
import {
  academicTermNameToSlug,
  academicTermToName, courseNameToSlug,
  courseToName,
  docToName, opportunityNameToSlug,
  profileNameToUsername,
  profileToName,
} from '../../../shared/utilities/data-model';
import { Reviews } from '../../../../../api/review/ReviewCollection';

interface AddReviewFormProps {
  terms: AcademicTerm[];
  courses: Course[];
  students: StudentProfile[];
  opportunities: Opportunity[];
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ terms, courses, opportunities, students }) => {
  const RadGradAlert = new RadGradAlerts();
  const [reviewType, setReviewType] = useState('');
  const termNames = terms.map(academicTermToName);
  const courseNames = courses.map(courseToName);
  const opportunityNames = opportunities.map(docToName);
  const reviewTypes = [Reviews.COURSE, Reviews.OPPORTUNITY];
  let revieweeNames;
  if (reviewType === Reviews.COURSE) {
    revieweeNames = courseNames;
  } else {
    revieweeNames = opportunityNames;
  }
  const studentNames = students.map(profileToName);

  let formRef;
  let schema = new SimpleSchema({
    academicTerm: {
      type: String,
      allowedValues: termNames,
    },
    reviewee: {
      type: String,
      allowedValues: revieweeNames,
    },
    student: {
      type: String,
      allowedValues: studentNames,
    },
    reviewType: { type: String, allowedValues: reviewTypes },
    rating: { type: SimpleSchema.Integer, min: 0, max: 5, optional: true },
    comments: String,
    moderated: { type: Boolean, optional: true },
    visible: { type: Boolean, optional: true },
    moderatorComments: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
  });

  const handleModelChange = (model) => {
    // console.log('change %o', model);
    setReviewType(model.reviewType);
    schema = new SimpleSchema({
      academicTerm: {
        type: String,
        allowedValues: termNames,
      },
      reviewee: {
        type: String,
        allowedValues: revieweeNames,
      },
      student: {
        type: String,
        allowedValues: studentNames,
      },
      reviewType: { type: String, allowedValues: reviewTypes },
      rating: { type: SimpleSchema.Integer, min: 0, max: 5, optional: true },
      comments: String,
      moderated: { type: Boolean, optional: true },
      visible: { type: Boolean, optional: true },
      moderatorComments: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
  };

  const handleAdd = (doc) => {
    // console.log('Reviews.handleAdd(%o)', doc);
    const collectionName = Reviews.getCollectionName();
    const definitionData = doc;
    definitionData.student = profileNameToUsername(doc.student);
    if (doc.reviewType === Reviews.COURSE) {
      definitionData.reviewee = courseNameToSlug(doc.reviewee);
    } else {
      definitionData.reviewee = opportunityNameToSlug(doc.reviewee);
    }
    definitionData.academicTerm = academicTermNameToSlug(doc.academicTerm);
    definitionData.slug = `review-${definitionData.reviewType}-${definitionData.reviewee}-${definitionData.student}`;
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => { RadGradAlert.failure('Add failed', error.message, 2500, error);})
      .then(() => {
        RadGradAlert.success('Add succeeded', '', 1500);
        formRef.reset();
      });
  };

  return (
    <Segment padded>
      <Header dividing>Add Review</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={new SimpleSchema2Bridge(schema)} onSubmit={handleAdd} ref={(ref) => formRef = ref}
                showInlineError onChangeModel={handleModelChange}>
        <Form.Group widths="equal">
          <SelectField name="reviewType" />
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
        <SubmitField className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField />
      </AutoForm>
    </Segment>
  );
};

export default AddReviewForm;
