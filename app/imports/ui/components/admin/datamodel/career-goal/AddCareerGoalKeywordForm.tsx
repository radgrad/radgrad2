import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField, SelectField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../../../api/career/CareerGoalCollection';
import { CareerGoalKeywords } from '../../../../../api/career/CareerGoalKeywordCollection';
import { Slugs } from '../../../../../api/slug/SlugCollection';
import { CareerGoal, CareerGoalKeywordDefine } from '../../../../../typings/radgrad';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { docToName } from '../../../shared/utilities/data-model';

interface AddCareerGoalKeywordFormProps {
  careerGoals: CareerGoal[];
}

const AddCareerGoalKeywordForm: React.FC<AddCareerGoalKeywordFormProps> = ({ careerGoals }) => {
  let formRef;

  const handleAdd = (doc) => {
    console.log('handleAdd', doc);
    const careerGoalName = doc.careerGoal;
    const careerGoalDoc = CareerGoals.findDoc(careerGoalName);
    const careerGoal = Slugs.getNameFromID(careerGoalDoc.slugID);
    const collectionName = CareerGoalKeywords.getCollectionName();
    const definitionData: CareerGoalKeywordDefine = {
      careerGoal,
      keyword: doc.keyword,
    };
    console.log(collectionName, definitionData);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => {
        RadGradAlert.failure('Failed adding Career Goal Keyword', error.message, error);
      })
      .then(() => {
        RadGradAlert.success('Add Career Goal Keyword Succeeded');
        formRef.reset();
      });
  };
  const careerGoalNames = careerGoals.map(docToName);
  const schema = new SimpleSchema({
    careerGoal: { type: String, allowedValues: careerGoalNames },
    keyword: String,
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Career Goal Keyword Pair</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <SelectField id={COMPONENTIDS.DATA_MODEL_CAREER_GOAL} name="careerGoal" />
        <TextField id={COMPONENTIDS.DATA_MODEL_KEYWORD} name="keyword" />
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>

    </Segment>
  );
};

export default AddCareerGoalKeywordForm;
