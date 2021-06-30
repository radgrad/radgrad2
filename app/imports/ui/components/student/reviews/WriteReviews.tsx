import React, { useState } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, LongTextField, SelectField, SubmitField } from 'uniforms-semantic';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { defineMethod } from '../../../../api/base/BaseCollection.methods';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { ReviewTypes } from '../../../../api/review/ReviewTypes';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { CourseInstance, OpportunityInstance, ReviewDefine } from '../../../../typings/radgrad';
import RatingField from '../explorer/RatingField';

interface WriteReviewsProps {
  unreviewedCourses: CourseInstance[];
  unreviewedOpportunities: OpportunityInstance[];
  username: string;
}

const WriteReviews: React.FC<WriteReviewsProps> = ({ unreviewedCourses, unreviewedOpportunities, username }) => {
  const cIDs = unreviewedCourses.map((ci) => ci.courseID);
  const courseNames = Courses.findNames(cIDs);
  let names = courseNames.map((cName) => `${cName} (Course)`);
  const oIDs = unreviewedOpportunities.map((oi) => oi.opportunityID);
  const opportunityNames = Opportunities.findNames(oIDs);
  names = names.concat(opportunityNames.map((oName) => `${oName} (Opportunity)`));
  names = _.uniq(names);
  const [choiceName, setChoiceName] = useState('');
  const [reviewType, setReviewType] = useState('');
  const [reviewee, setReviewee] = useState('');
  const [termNames, setTermNames] = useState([]);


  const handleChoiceChange = (name, value) => {
    console.log(name, value);
    const strippedName = value.substring(0, value.indexOf('(') - 1);
    setChoiceName(strippedName);
    if (courseNames.includes(strippedName)) {
      setReviewType(Reviews.COURSE);
      const course = Courses.findDoc(strippedName);
      setReviewee(Slugs.getNameFromID(course.slugID));
      const selectedCIs = unreviewedCourses.filter((ci) => ci.courseID === course._id);
      const terms = selectedCIs.map((ci) => AcademicTerms.toString(ci.termID));
      setTermNames(terms);
    } else {
      setReviewType(Reviews.OPPORTUNITY);
      const opp = Opportunities.findDoc(strippedName);
      setReviewee(Slugs.getNameFromID(opp.slugID));
      const selectedOIs = unreviewedOpportunities.filter((oi) => oi.opportunityID === opp._id);
      const terms = selectedOIs.map((oi) => AcademicTerms.toString(oi.termID));
      setTermNames(terms);
    }

  };

  let reviewFormRef;
  let choiceFormRef;
  const handleSubmit = (model) => {
    choiceFormRef.reset();
    reviewFormRef.reset();
    setChoiceName('');
    const collectionName = Reviews.getCollectionName();
    let academicTermDoc;
    if (termNames.length === 1) {
      academicTermDoc = AcademicTerms.getAcademicTermFromToString(termNames[0]);
    } else {
      academicTermDoc = AcademicTerms.getAcademicTermFromToString(model.academicTerm);
    }
    const academicTermSlug = AcademicTerms.findSlugByID(academicTermDoc._id);
    const definitionData: ReviewDefine = model;
    definitionData.academicTerm = academicTermSlug;
    definitionData.student = username;
    definitionData.reviewType = reviewType as ReviewTypes;
    definitionData.reviewee = reviewee;
    definitionData.visible = false;
    // console.log(collectionName, definitionData);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => { RadGradAlert.failure('Add Failed', error.message, error);})
      .then(() => { RadGradAlert.success('Review Added');});
  };

  const choiceSchema = new SimpleSchema({
    courseOrOpportunityToReview: {
      type: String,
      allowedValues: names,
    },
  });
  const choiceFormSchema = new SimpleSchema2Bridge(choiceSchema);

  const reviewSchema = new SimpleSchema({
    academicTerm: {
      type: String,
      allowedValues: termNames,
      defaultValue: termNames[0],
    },
    rating: {
      type: SimpleSchema.Integer,
      label: 'Rating',
      min: 0,
      max: 5,
      defaultValue: 3,
    },
    comments: {
      type: String,
      label: 'Comments',
    },
  });
  const reviewFormSchema = new SimpleSchema2Bridge(reviewSchema);
  const disabled = choiceName === '';
  return (
    <div>
      <Header>Please consider writing a review for your <strong>completed Courses or
        Opportunities.</strong></Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm ref={(ref) => choiceFormRef = ref} schema={choiceFormSchema} onChange={handleChoiceChange}>
        <SelectField name='courseOrOpportunityToReview' id={COMPONENTIDS.STUDENT_COURSE_OR_OPPORTUNITY} />
        <ErrorsField />
      </AutoForm>
      <Segment basic>
        {/* eslint-disable-next-line no-return-assign */}
        <AutoForm ref={(ref) => reviewFormRef = ref} schema={reviewFormSchema} onSubmit={handleSubmit}>
          <Grid>
            <Grid.Column width={6} verticalAlign='middle'>
              Select the term you participated in.
            </Grid.Column>
            <Grid.Column width={10}>
              {termNames.length <= 1 ? <SelectField name='academicTerm' disabled /> : <SelectField name='academicTerm' disabled={disabled} />}
            </Grid.Column>
            <Grid.Column width={6} verticalAlign='middle'>
              Rate your overall satisfaction.
            </Grid.Column>
            <Grid.Column width={10}>
              <RatingField name='rating' disabled={disabled} />
            </Grid.Column>
            <Grid.Column width={6} verticalAlign='middle'>
              Please provide three or four sentences discussing your experience. Please use language your
              parents
              would
              find appropriate :)
            </Grid.Column>
            <Grid.Column width={10}>
              <LongTextField name='comments' disabled={disabled} id={COMPONENTIDS.STUDENT_REVIEW_COMMENT} />
            </Grid.Column>
            <Grid.Column width={6}>
              <SubmitField id={COMPONENTIDS.STUDENT_REVIEW_SUBMIT} />
            </Grid.Column>
          </Grid>
          <ErrorsField />
        </AutoForm>
      </Segment>
    </div>
  );
};

export default WriteReviews;
