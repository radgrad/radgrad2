import React, { useState } from 'react';
import { Header } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, LongTextField, SelectField, SubmitField } from 'uniforms-semantic';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { CourseInstance, OpportunityInstance } from '../../../../typings/radgrad';
import RatingField from '../explorer/RatingField';

interface WriteReviewsProps {
  unreviewedCourses: CourseInstance[];
  unreviewedOpportunities: OpportunityInstance[];
}

const WriteReviews: React.FC<WriteReviewsProps> = ({ unreviewedCourses, unreviewedOpportunities }) => {
  const cIDs = unreviewedCourses.map((ci) => ci.courseID);
  const courseNames = Courses.findNames(cIDs);
  let names = courseNames.map((cName) => `${cName} (Course)`);
  const oIDs = unreviewedOpportunities.map((oi) => oi.opportunityID);
  const opportunityNames = Opportunities.findNames(oIDs);
  names = names.concat(opportunityNames.map((oName) => `${oName} (Opportunity)`));
  names = _.uniq(names);
  const [choiceName, setChoiceName] = useState('');

  const handleChange = (name, value) => {
    console.log(name, value);
    const strippedName = value.substring(0, value.indexOf('(') - 1);
    setChoiceName(strippedName);
  };

  let formRef;
  const handleSubmit = (model) => {
    console.log(model);
    formRef.reset();
  };

  const choiceSchema = new SimpleSchema({
    courseOrOpportunityToReview: {
      type: String,
      allowedValues: names,
    },
  });
  const choiceFormSchema = new SimpleSchema2Bridge(choiceSchema);

  const reviewSchema = new SimpleSchema({
    rating: {
      type: SimpleSchema.Integer,
      label: 'Rating',
      min: 0,
      max: 5,
      optional: true,
      defaultValue: 3,
    },
    comments: {
      type: String,
      label: 'Comments',
    },
  });
  const reviewFormSchema = new SimpleSchema2Bridge(reviewSchema);
  let reviewType;
  if (courseNames.includes(choiceName)) {
    reviewType = Reviews.COURSE;
  } else {
    reviewType = Reviews.OPPORTUNITY;
  }
  console.log(choiceName, reviewType);
  return (
    <div>
      <Header>Please consider writing a review for your <strong>completed Courses or Opportunities.</strong></Header>
      <AutoForm schema={choiceFormSchema} onChange={handleChange}>
        <SelectField name='courseOrOpportunityToReview' />
      </AutoForm>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm ref={(ref) => formRef = ref} schema={reviewFormSchema} onSubmit={handleSubmit}>
        <RatingField name='rating' />
        <LongTextField name='comments' placeholder='Please provide three or four sentences discussing your experience. Please use language your parents would find appropriate :)' />
        <SubmitField />
      </AutoForm>
    </div>
  );
};

export default WriteReviews;
