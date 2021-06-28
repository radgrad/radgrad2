import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, SelectField, NumField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { AcademicTerm, Course, Opportunity, ReviewDefine, StudentProfile } from '../../../../../typings/radgrad';
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
    const student = profileNameToUsername(doc.student);
    let reviewee;
    if (doc.reviewType === Reviews.COURSE) {
      reviewee = courseNameToSlug(doc.reviewee);
    } else {
      reviewee = opportunityNameToSlug(doc.reviewee);
    }
    const academicTerm = academicTermNameToSlug(doc.academicTerm);
    const definitionData: ReviewDefine = { student, reviewee, reviewType: doc.reviewType, academicTerm, comments: doc.comments, moderatorComments: doc.moderatorComments, moderated: doc.moderated, retired: doc.retired, rating: doc.rating, visible: doc.visible };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => { RadGradAlert.failure('Add failed', error.message, error);})
      .then(() => {
        RadGradAlert.success('Add succeeded');
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
          <SelectField id={COMPONENTIDS.DATA_MODEL_REVIEW_TYPE} name="reviewType" />
          <SelectField id={COMPONENTIDS.DATA_MODEL_STUDENT} name="student" />
          <SelectField id={COMPONENTIDS.DATA_MODEL_REVIEWEE} name="reviewee" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField id={COMPONENTIDS.DATA_MODEL_ACADEMIC_TERM} name="academicTerm" />
          <NumField id={COMPONENTIDS.DATA_MODEL_RATING} name="rating" />
        </Form.Group>
        <LongTextField id={COMPONENTIDS.DATA_MODEL_COMMENTS} name="comments" />
        <Form.Group>
          <BoolField id={COMPONENTIDS.DATA_MODEL_MODERATED} name="moderated" />
          <BoolField id={COMPONENTIDS.DATA_MODEL_VISIBLE} name="visible" />
        </Form.Group>
        <LongTextField id={COMPONENTIDS.DATA_MODEL_MODERATOR_COMMENTS} name="moderatorComments" />
        <BoolField id={COMPONENTIDS.DATA_MODEL_RETIRED} name="retired" />
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddReviewForm;
