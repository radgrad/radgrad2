import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { IInterest, IOpportunity, ICareerGoal, ICourse } from '../../../../../typings/radgrad';
import { docToName, slugIDToSlugNameAndType } from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface IAddTeaserFormProps {
  careerGoals: ICareerGoal[];
  courses: ICourse[];
  interests: IInterest[];
  opportunities: IOpportunity[];
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
}

const AddTeaserForm: React.FC<IAddTeaserFormProps> = ({ careerGoals, courses, interests, opportunities, formRef, handleAdd }) => {
  let careerGoalSlugNames = _.map(careerGoals, (goal) => slugIDToSlugNameAndType(goal.slugID));
  careerGoalSlugNames = _.sortBy(careerGoalSlugNames);
  let courseSlugNames = _.map(courses, (c) => slugIDToSlugNameAndType(c.slugID));
  courseSlugNames = _.sortBy(courseSlugNames);
  let interestSlugNames = _.map(interests, (i) => slugIDToSlugNameAndType(i.slugID));
  interestSlugNames = _.sortBy(interestSlugNames);
  let opportunitySlugNames = _.map(opportunities, (o) => slugIDToSlugNameAndType(o.slugID));
  opportunitySlugNames = _.sortBy(opportunitySlugNames);
  const allSlugNames = opportunitySlugNames.concat(courseSlugNames.concat(interestSlugNames.concat(careerGoalSlugNames)));
  const interestNames = _.map(interests, docToName);
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
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={formRef} showInlineError>
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

export default AddTeaserForm;
