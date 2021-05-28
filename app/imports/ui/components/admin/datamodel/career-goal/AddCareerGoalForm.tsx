import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../../../api/career/CareerGoalCollection';
import { Interests } from '../../../../../api/interest/InterestCollection';
import slugify, { Slugs } from '../../../../../api/slug/SlugCollection';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { Interest } from '../../../../../typings/radgrad';
import { docToName } from '../../../shared/utilities/data-model';

interface AddCareerGoalFormProps {
  interests: Interest[];
}

const AddCareerGoalForm: React.FC<AddCareerGoalFormProps> = ({ interests }) => {

  let formRef;

  const handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = CareerGoals.getCollectionName();
    const docInterests = doc.interests;
    const slugs = docInterests.map((i) => Slugs.getNameFromID(Interests.findDoc({ name: i }).slugID));
    const definitionData = doc;
    definitionData.interests = slugs;
    definitionData.slug = slugify(doc.name);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => {
        console.error('Failed adding User', error);
        Swal.fire({
          title: 'Failed adding User',
          text: error.message,
          icon: 'error',
        });
      })
      .then(() => {
        Swal.fire({
          title: 'Add User Succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
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
        <TextField name="name" placeholder="Software Engineer" />
        <MultiSelectField name="interests" placeholder="Select interest(s)" />
        <TextField placeholder='https://mywebsite.com/picture.png' name='picture'/>
        <LongTextField name="description" placeholder="Describe the Career Goal here" />
        <SubmitField className="mini basic green" value="Add" />
        <ErrorsField />
      </AutoForm>
    </Segment>
  );
};

export default AddCareerGoalForm;
