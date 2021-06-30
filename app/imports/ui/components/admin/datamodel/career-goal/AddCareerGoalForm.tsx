import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../../../api/career/CareerGoalCollection';
import { Interests } from '../../../../../api/interest/InterestCollection';
import slugify, { Slugs } from '../../../../../api/slug/SlugCollection';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { CareerGoalDefine, Interest } from '../../../../../typings/radgrad';
import PictureField from '../../../form-fields/PictureField';
import { docToName } from '../../../shared/utilities/data-model';
import RadGradAlert from '../../../../utilities/RadGradAlert';

interface AddCareerGoalFormProps {
  interests: Interest[];
}

const AddCareerGoalForm: React.FC<AddCareerGoalFormProps> = ({ interests }) => {
  let formRef;

  const handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = CareerGoals.getCollectionName();
    const slugs = doc.interests.map((i) => Slugs.getNameFromID(Interests.findDoc({ name: i }).slugID));
    // Don't assign doc to definitionData since we need to change the interests.
    const definitionData: CareerGoalDefine = { name: doc.name, slug: doc.slug, description: doc.description, interests: slugs };
    definitionData.slug = slugify(doc.name);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => {
        RadGradAlert.failure('Failed adding Career Goal', error.message, error);
      })
      .then(() => {
        RadGradAlert.success('Add Career Goal Succeeded');
        formRef.reset();
      });
  };

  const interestNames = interests.map(docToName);
  const schema = new SimpleSchema({
    name: String,
    description: String,
    interests: {
      type: Array,
    },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    picture: {
      type: String,
      optional: true,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Career Goal</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <TextField id={COMPONENTIDS.DATA_MODEL_NAME} name="name" placeholder="Software Engineer" />
        <MultiSelectField id={COMPONENTIDS.DATA_MODEL_INTERESTS} name="interests" placeholder="Select interest(s)" />
        <PictureField id={COMPONENTIDS.DATA_MODEL_PICTURE} name="picture" placeholder='https://mywebsite.com/picture.png'/>
        <LongTextField id={COMPONENTIDS.DATA_MODEL_DESCRIPTION} name="description" placeholder="Describe the Career Goal here" />
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddCareerGoalForm;
