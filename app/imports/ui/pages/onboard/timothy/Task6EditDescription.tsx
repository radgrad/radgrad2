import React from 'react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, SubmitField, LongTextField } from 'uniforms-semantic';

interface EditInterestButtonProps {
  interestDesc: string;
  updateDesc: (doc) => any;
}

const Task6EditDescription: React.FC<EditInterestButtonProps> = ({ interestDesc, updateDesc }) => {
  const schema = new SimpleSchema({
    description: { type: String, defaultValue: interestDesc },
  });

  const formSchema = new SimpleSchema2Bridge(schema);

  const submit = (doc) => {
    updateDesc(doc);
  };

  return (
  <div>
    <AutoForm schema={formSchema} onSubmit={submit}>
      <LongTextField name="description" required/>
      <SubmitField className="mini basic green" value='Update Description'/>
    </AutoForm>
  </div>
  );
};

export default Task6EditDescription;
