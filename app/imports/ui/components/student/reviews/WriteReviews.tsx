import React, { useState } from 'react';
import { Header, Rating } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, LongTextField, SubmitField } from 'uniforms-semantic';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { CourseInstance, OpportunityInstance } from '../../../../typings/radgrad';
import RatingField from '../explorer/RatingField';

interface WriteReviewsProps {
  unreviewedCourses: CourseInstance[];
  unreviewedOpportunities: OpportunityInstance[];
}

const WriteReviews: React.FC<WriteReviewsProps> = ({ unreviewedCourses, unreviewedOpportunities }) => {
  const cIDs = unreviewedCourses.map((ci) => ci.courseID);
  let names = Courses.findNames(cIDs);
  const oIDs = unreviewedOpportunities.map((oi) => oi.opportunityID);
  names = names.concat(Opportunities.findNames(oIDs));
  const [numStars, setNumStars] = useState(3);
  const handleRate = (e, { rating, maxRating }) => {
    setNumStars(rating);
  };

  console.log(names);
  console.log(numStars);
  const schema = new SimpleSchema({
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
  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <div>
      <Header>Please consider writing a review for your <strong>completed Courses or Opportunities.</strong></Header>
      <Rating icon='star' rating={3} maxRating={5} onRate={handleRate} size='huge' />
      <div className="ui yellow rating" data-icon="star" data-rating="3" data-max-rating="5" />
      <AutoForm schema={formSchema} onSubmit={(doc) => console.log(doc)}>
        <Rating icon='star' rating={3} maxRating={5} onRate={handleRate} />
        <RatingField name='rating' />
        <LongTextField name='comments' placeholder='Please provide three or four sentences discussing your experience. Please use language your parents would find appropriate :)' />
        <SubmitField />
      </AutoForm>
    </div>
  );
};

export default WriteReviews;
