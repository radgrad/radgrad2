import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import BaseCollection from '../../../../../api/base/BaseCollection';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import {
  docToName,
  interestIdToName,
  itemToSlugName,
  slugIDToSlugNameAndType,
  docToSlugNameAndType,
} from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface UpdateTeaserFormProps {
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  collection: BaseCollection;
  id: string;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateTeaserForm: React.FC<UpdateTeaserFormProps> = ({
  careerGoals,
  courses,
  interests,
  opportunities,
  collection,
  id,
  handleUpdate,
  handleCancel,
  itemTitleString,
}) => {
  const model = collection.findDoc(id);
  model.slug = itemToSlugName(model);
  model.interests = model.interestIDs.map(interestIdToName);
  model.youtubeID = model.url;
  const modelSlugAndType = slugIDToSlugNameAndType(model.targetSlugID);
  const interestNames = interests.map(docToName);
  const opportunitySlugs = opportunities.map(docToSlugNameAndType);
  const courseSlugs = courses.map(docToSlugNameAndType);
  const interestSlugs = interests.map(docToSlugNameAndType);
  const careerGoalSlugs = careerGoals.map(docToSlugNameAndType);
  const schema = new SimpleSchema({
    title: String,
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
    targetSlug: {
      type: String,
      allowedValues: opportunitySlugs.concat(courseSlugs.concat(interestSlugs.concat(careerGoalSlugs))),
      optional: true,
      defaultValue: modelSlugAndType,
    },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  // console.log('model', model);
  return (
    <Segment padded>
      <Header dividing>
                Update
        {collection.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={model}>
        <Form.Group widths="equal">
          <TextField name="title"/>
          <TextField name="author"/>
        </Form.Group>
        <Form.Group widths="equal">
          <SelectField name="targetSlug"/>
          <TextField name="youtubeID"/>
          <TextField name="duration"/>
        </Form.Group>
        <Form.Group widths="equal">
          <MultiSelectField name="interests"/>
        </Form.Group>
        <LongTextField name="description"/>
        <BoolField name="retired"/>
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="mini basic green"/>
        <Button onClick={handleCancel} basic color="green" size="mini">Cancel</Button>
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default UpdateTeaserForm;
