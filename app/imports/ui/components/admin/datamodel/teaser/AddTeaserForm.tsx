import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Teasers } from '../../../../../api/teaser/TeaserCollection';
import { Interest, Opportunity, CareerGoal, Course } from '../../../../../typings/radgrad';
import {
  docToName,
  interestNameToSlug,
  slugIDToSlugNameAndType,
  slugNameAndTypeToName,
} from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface AddTeaserFormProps {
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
}

const AddTeaserForm: React.FC<AddTeaserFormProps> = ({ careerGoals, courses, interests, opportunities }) => {
  let formRef;
  let careerGoalSlugNames = careerGoals.map((goal) => slugIDToSlugNameAndType(goal.slugID));
  careerGoalSlugNames = _.sortBy(careerGoalSlugNames);
  let courseSlugNames = courses.map((c) => slugIDToSlugNameAndType(c.slugID));
  courseSlugNames = _.sortBy(courseSlugNames);
  let interestSlugNames = interests.map((i) => slugIDToSlugNameAndType(i.slugID));
  interestSlugNames = _.sortBy(interestSlugNames);
  let opportunitySlugNames = opportunities.map((o) => slugIDToSlugNameAndType(o.slugID));
  opportunitySlugNames = _.sortBy(opportunitySlugNames);
  const allSlugNames = opportunitySlugNames.concat(courseSlugNames.concat(interestSlugNames.concat(careerGoalSlugNames)));
  const interestNames = interests.map(docToName);
  const schema = new SimpleSchema({
    title: String,
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

  const handleAdd = (doc) => {
    console.log('Teasers.handleAdd(%o)', doc);
    const collectionName = Teasers.getCollectionName();
    const definitionData = doc;
    definitionData.interests = doc.interests.map(interestNameToSlug);
    definitionData.targetSlug = slugNameAndTypeToName(doc.targetSlug);
    definitionData.url = doc.youtubeID;
    definitionData.slug = `${definitionData.targetSlug}-teaser`;
    // definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
    // console.log(collectionName, definitionData);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          icon: 'error',
        });
      })
      .then(() => {
        Swal.fire({
          title: 'Add succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        formRef.reset();
      });
  };

  return (
    <Segment padded>
      <Header dividing>Add Teaser</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <Form.Group widths="equal">
          <TextField name="title" />
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
        <SubmitField className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField />
      </AutoForm>
    </Segment>
  );
};

export default AddTeaserForm;
