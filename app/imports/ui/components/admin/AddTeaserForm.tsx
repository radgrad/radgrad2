import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { IInterest, IOpportunity, ICareerGoal, ICourse } from '../../../typings/radgrad';
import { docToName, slugIDToSlugNameAndType } from '../shared/data-model-helper-functions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import MultiSelectField from '../form-fields/MultiSelectField';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';

interface IAddTeaserFormProps {
  careerGoals: ICareerGoal[];
  courses: ICourse[];
  interests: IInterest[];
  opportunities: IOpportunity[];
  formRef: any;
  handleAdd: (doc) => any;
}

const AddTeaserForm = (props: IAddTeaserFormProps) => {
  let careerGoalSlugNames = _.map(props.careerGoals, (goal) => slugIDToSlugNameAndType(goal.slugID));
  careerGoalSlugNames = _.sortBy(careerGoalSlugNames);
  let courseSlugNames = _.map(props.courses, (c) => slugIDToSlugNameAndType(c.slugID));
  courseSlugNames = _.sortBy(courseSlugNames);
  let interestSlugNames = _.map(props.interests, (i) => slugIDToSlugNameAndType(i.slugID));
  interestSlugNames = _.sortBy(interestSlugNames);
  let opportunitySlugNames = _.map(props.opportunities, (o) => slugIDToSlugNameAndType(o.slugID));
  opportunitySlugNames = _.sortBy(opportunitySlugNames);
  const allSlugNames = opportunitySlugNames.concat(courseSlugNames.concat(interestSlugNames.concat(careerGoalSlugNames)));
  const interestNames = _.map(props.interests, docToName);
  const schema = new SimpleSchema({
    title: String,
    slug: String,
    author: String,
    youtubeID: String,
    description: String,
    targetSlug: {
      type: String,
      allowedValues: allSlugNames,
    },
    duration: String,
    interests: {
      type: Array,
    },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Teaser</Header>
      <AutoForm schema={formSchema} onSubmit={props.handleAdd} ref={props.formRef} showInlineError>
        <Form.Group widths="equal">
          <TextField name="title" />
          <TextField name="slug" />
          <TextField name="author" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="targetSlug" />
          <TextField name="youtubeID" />
          <TextField name="duration" />
        </Form.Group>
        <MultiSelectField name="interests" />
        <LongTextField name="description" />
        <BoolField name="retired" />
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

const AddTeaserFormContainer = withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired({}, { sort: { name: 1 } });
  const courses = Courses.findNonRetired({}, { sort: { num: 1 } });
  const interests = Interests.findNonRetired({}, { sort: { name: 1 } });
  const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
  return {
    careerGoals,
    courses,
    interests,
    opportunities,
  };
})(AddTeaserForm);

export default AddTeaserFormContainer;
