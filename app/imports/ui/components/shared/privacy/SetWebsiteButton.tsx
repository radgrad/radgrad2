import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import { COMPONENTIDS } from '../../../utilities/ComponentIDs';

interface SetWebsiteButtonProps {
  website: string,
  handleChange: (data) => void,
}

const formSchema = new SimpleSchema({
  website: { type: String, optional: true, label: 'Enter website URL (empty string removes website data)' },
});
const bridge = new SimpleSchema2Bridge(formSchema);


export const SetWebsiteButton: React.FC<SetWebsiteButtonProps> = ({ website, handleChange }) => {
  const [open, setOpen] = useState(false);

  const submit = (data) => {
    handleChange(data.website);
    setOpen(false);
  };

  return (
    <Modal size='small'
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button id={COMPONENTIDS.SET_WEBSITE_BUTTON} size='mini'>{website ? 'Edit' : 'Add'}</Button>}
    >
      <Modal.Header>Add, edit, or remove website</Modal.Header>
      <Modal.Content>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={{ website }}>
          <TextField id={COMPONENTIDS.SET_WEBSITE_TEXT} placeholder='https://mywebsite.com' name='website'/>
          <SubmitField id={COMPONENTIDS.SUBMIT_WEBSITE_BUTTON} value='Submit'/>
          <ErrorsField/>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};
