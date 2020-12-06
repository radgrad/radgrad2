import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { ICareerGoal, ICourse, IInterest, IOpportunity } from '../../../../../typings/radgrad';
import BaseCollection from '../../../../../api/base/BaseCollection';
import {
  docToName,
  interestIdToName, itemToSlugName,
  opportunityIdToName,
  slugIDToSlugNameAndType,
  docToSlugNameAndType,
} from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface IUpdateTeaserFormProps {
  careerGoals: ICareerGoal[];
  courses: ICourse[];
  interests: IInterest[];
  opportunities: IOpportunity[];
  collection: BaseCollection;
  id: string;
  formRef: React.RefObject<unknown>;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateTeaserForm: React.FC<IUpdateTeaserFormProps> = ({ careerGoals, courses, interests, opportunities, collection, id, formRef, handleUpdate, handleCancel, itemTitleString }) => {
  const model = collection.findDoc(id);
  model.slug = itemToSlugName(model);
  model.opportunity = opportunityIdToName(model.opportunityID);
  model.interests = _.map(model.interestIDs, interestIdToName);
  model.youtubeID = model.url;
  const modelSlugAndType = slugIDToSlugNameAndType(model.targetSlugID);
  const interestNames = _.map(interests, docToName);
  const opportunitySlugs = _.map(opportunities, docToSlugNameAndType);
  const courseSlugs = _.map(courses, docToSlugNameAndType);
  const interestSlugs = _.map(interests, docToSlugNameAndType);
  const careerGoalSlugs = _.map(careerGoals, docToSlugNameAndType);
  const schema = new SimpleSchema({
    title: String,
    slug: String,
    author: { type: String, optional: true },
    youtubeID: { type: String, optional: true },
    description: { type: String, optional: true },
    duration: { type: String, optional: true },
    interests: {
      type: Array,
      optional: true,
    },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    targetSlug: { type: String, allowedValues: opportunitySlugs.concat(courseSlugs.concat(interestSlugs.concat(careerGoalSlugs))), optional: true, defaultValue: modelSlugAndType },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {collection.getType()}
        :
        {itemTitleString(model)}
      </Header>
      <AutoForm
        schema={formSchema}
        onSubmit={handleUpdate}
        ref={formRef}
        showInlineError
        model={model}
      >
        <Form.Group widths="equal">
          <TextField name="title" />
          <TextField name="slug" disabled />
          <TextField name="author" />
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="targetSlug" />
          <TextField name="youtubeID" />
          <TextField name="duration" />
        </Form.Group>
        <LongTextField name="description" />
        <Form.Group widths="equal">
          <MultiSelectField name="interests" />
        </Form.Group>
        <BoolField name="retired" />
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateTeaserForm;
