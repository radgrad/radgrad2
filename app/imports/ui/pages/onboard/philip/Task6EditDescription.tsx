import React from 'react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, SubmitField, LongTextField } from 'uniforms-semantic';

interface Task6EditDescriptionProps {
  description: string;
  onEditDescription: (newDescription) => any;
}

const Task6EditDescription: React.FC<Task6EditDescriptionProps> = ({ description, onEditDescription }) => {
  const schema = new SimpleSchema({
    description: { type: String },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const onSubmit = (model) => onEditDescription(model.description);
  const model = { description };

  return (
      <AutoForm schema={formSchema} onSubmit={onSubmit} model={model}>
        <LongTextField name="description" />
        <SubmitField className="mini basic green" value="Update Description" />
      </AutoForm>
  );
};

export default Task6EditDescription;
