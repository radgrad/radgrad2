import React from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Teasers } from '../../../../../api/teaser/TeaserCollection';
import { Interest, Opportunity, CareerGoal, Course, TeaserDefine } from '../../../../../typings/radgrad';
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
    // console.log('Teasers.handleAdd(%o)', doc);
    const collectionName = Teasers.getCollectionName();
    const interestSlugs = doc.interests.map(interestNameToSlug);
    const targetSlug = slugNameAndTypeToName(doc.targetSlug);
    const url = doc.youtubeID;
    const definitionData: TeaserDefine = { title: doc.title, url, author: doc.author, interests: interestSlugs, targetSlug, description: doc.description, slug: `${doc.targetSlug}-teaser`, duration: doc.duration, retired: doc.retired };
    // definitionData.opportunity = opportunityNameToSlug(doc.opportunity);
    // console.log(collectionName, definitionData);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => { RadGradAlert.failure('Add failed', error.message, error);})
      .then(() => {
        RadGradAlert.success('Add succeeded');
        formRef.reset();
      });
  };

  return (
    <Segment padded>
      <Header dividing>Add Teaser</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <Form.Group widths="equal">
          <TextField id={COMPONENTIDS.DATA_MODEL_TITLE} name="title" />
          <TextField id={COMPONENTIDS.DATA_MODEL_AUTHOR} name="author" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField id={COMPONENTIDS.DATA_MODEL_TARGET_SLUG} name="targetSlug" />
          <TextField id={COMPONENTIDS.DATA_MODEL_YOUTUBE_ID} name="youtubeID" />
          <TextField id={COMPONENTIDS.DATA_MODEL_DURATION} name="duration" />
        </Form.Group>
        <MultiSelectField id={COMPONENTIDS.DATA_MODEL_INTERESTS} name="interests" />
        <LongTextField id={COMPONENTIDS.DATA_MODEL_DESCRIPTION} name="description" />
        <BoolField id={COMPONENTIDS.DATA_MODEL_RETIRED} name="retired" />
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddTeaserForm;
