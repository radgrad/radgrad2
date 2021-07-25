import React from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, BoolField, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import { CareerGoalKeywords } from '../../../../../api/career/CareerGoalKeywordCollection';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';

interface UpdateCareerGoalKeywordFormProps {
  id: string;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

const UpdateCareerGoalKeywordForm: React.FC<UpdateCareerGoalKeywordFormProps> = ({ id, handleUpdate, handleCancel, itemTitleString }) => {
  const model = id ? CareerGoalKeywords.findDoc(id) : undefined;
  const schema = new SimpleSchema({
    keyword: { type: String, optional: true },
    retired: { type: Boolean, optional: true },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {CareerGoalKeywords.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} showInlineError model={model}>
        <TextField name="keyword" />
        <BoolField name="retired" />
        <p />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
        <SubmitField value="Update" disabled={false} className="mini basic green" />
        <Button onClick={handleCancel} basic color="green" size="mini">Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

export default UpdateCareerGoalKeywordForm;
