import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, BoolField, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import { InterestKeywords } from '../../../../../api/interest/InterestKeywordCollection';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';

interface UpdateInterestKeywordFormProps {
  id: string;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateInterestKeywordForm: React.FC<UpdateInterestKeywordFormProps> = ({ id, handleUpdate, handleCancel, itemTitleString }) => {
  const model = id ? InterestKeywords.findDoc(id) : undefined;
  const schema = new SimpleSchema({
    keyword: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {InterestKeywords.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={model}>
        <TextField id={COMPONENTIDS.DATA_MODEL_KEYWORD} name="keyword" />
        <BoolField id={COMPONENTIDS.DATA_MODEL_RETIRED} name="retired" />
        <p />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} value="Update" disabled={false} className="mini basic green" />
        <Button onClick={handleCancel} basic color="green" size="mini">Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateInterestKeywordForm;
