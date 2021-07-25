import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SubmitField, ErrorsField, SelectField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { InterestKeywords } from '../../../../../api/interest/InterestKeywordCollection';
import { Slugs } from '../../../../../api/slug/SlugCollection';
import { Interest, InterestKeywordDefine } from '../../../../../typings/radgrad';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { docToName } from '../../../shared/utilities/data-model';

interface AddCareerGoalKeywordFormProps {
  interests: Interest[];
}

const AddInterestKeywordForm: React.FC<AddCareerGoalKeywordFormProps> = ({ interests }) => {
  let formRef;

  const handleAdd = (doc) => {
    // console.log('handleAdd', doc);
    const interestName = doc.interest;
    const interestDoc = Interests.findDoc(interestName);
    const interest = Slugs.getNameFromID(interestDoc.slugID);
    const collectionName = InterestKeywords.getCollectionName();
    const definitionData: InterestKeywordDefine = {
      interest,
      keyword: doc.keyword,
    };
    // console.log(collectionName, definitionData);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => {
        RadGradAlert.failure('Failed adding Interest Keyword', error.message, error);
      })
      .then(() => {
        RadGradAlert.success('Add Interest Keyword Succeeded');
        formRef.reset();
      });
  };
  const interestNames = interests.map(docToName);
  const schema = new SimpleSchema({
    interest: { type: String, allowedValues: interestNames },
    keyword: String,
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Interest Keyword Pair</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <SelectField id={COMPONENTIDS.DATA_MODEL_INTEREST} name="interest" />
        <TextField id={COMPONENTIDS.DATA_MODEL_KEYWORD} name="keyword" />
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddInterestKeywordForm;
