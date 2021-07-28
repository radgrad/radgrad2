import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, LongTextField, BoolField, SubmitField, ErrorsField, AutoField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../../api/interest/InterestCollection';
import slugify from '../../../../../api/slug/SlugCollection';
import { InterestDefine, InterestType } from '../../../../../typings/radgrad';
import PictureField from '../../../form-fields/PictureField';
import { docToName, interestTypeNameToSlug } from '../../../shared/utilities/data-model';

interface AddInterestFormProps {
  interestTypes: InterestType[];
}

const AddInterestForm: React.FC<AddInterestFormProps> = ({ interestTypes }) => {
  let formRef;
  const handleAdd = (doc) => {
    console.log('Interests.handleAdd(%o)', doc);
    const collectionName = Interests.getCollectionName();
    const definitionData: InterestDefine = { name: doc.name, slug: `${slugify(doc.name)}-interests`, description: doc.description, interestType: interestTypeNameToSlug(doc.interestType), picture: doc.picture, retired: doc.retired, keywords: doc.keywords };
    // console.log(collectionName, definitionData);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => { RadGradAlert.failure('Failed to add Interest', error.message, error);})
      .then(() => {
        RadGradAlert.success('Add Interest Succeeded');
        formRef?.reset();
      });
  };


  const interestTypeNames = interestTypes.map(docToName);
  const schema = new SimpleSchema({
    name: String,
    interestType: { type: String, allowedValues: interestTypeNames, defaultValue: interestTypeNames[0] },
    description: String,
    picture: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
    keywords: { type: Array, optional: true }, // TODO should this be optional?
    'keywords.$': { type: String },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add Interest</Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={handleAdd} ref={(ref) => formRef = ref} showInlineError>
        <Form.Group widths="equal">
          <TextField id={COMPONENTIDS.DATA_MODEL_NAME} name="name" placeholder="Rust Programming Language" />
          <SelectField id={COMPONENTIDS.DATA_MODEL_INTEREST_TYPE} name="interestType" />
        </Form.Group>
        <PictureField id={COMPONENTIDS.DATA_MODEL_PICTURE} name="picture" placeholder='https://mywebsite.com/picture.png' />
        <LongTextField id={COMPONENTIDS.DATA_MODEL_DESCRIPTION} name="description" />
        <BoolField id={COMPONENTIDS.DATA_MODEL_RETIRED} name="retired" />
        <AutoField name="keywords" />
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddInterestForm;
