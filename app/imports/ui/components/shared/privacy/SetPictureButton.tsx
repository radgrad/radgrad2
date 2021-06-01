import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { openCloudinaryWidget } from '../OpenCloudinaryWidget';

interface SetPictureButtonProps {
  picture: string,
  handleChange: (data) => void,
}

const formSchema = new SimpleSchema({
  picture: { type: String, optional: true, label: 'Type in picture URL manually (empty string removes picture)' },
});
const bridge = new SimpleSchema2Bridge(formSchema);


export const SetPictureButton: React.FC<SetPictureButtonProps> = ({ picture, handleChange }) => {
  const [open, setOpen] = useState(false);

  const submit = (data) => {
    handleChange(data.picture);
    setOpen(false);
  };

  const handleUploadClick = async (): Promise<void> => {
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        handleChange(cloudinaryResult.info.secure_url);
        setOpen(false);
      }
    } catch (error) {
      RadGradAlert.failure('Failed to Upload Photo', error.statusText, error);
    }
  };

  return (
    <Modal size='small'
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button size='mini'>{picture ? 'Edit' : 'Add'}</Button>}
    >
      <Modal.Header>Add, edit, or remove picture</Modal.Header>
      <Modal.Content>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={{ picture }}>
          <TextField placeholder='https://mywebsite.com/picture.png' name='picture'/>
          <SubmitField value='Submit'/>
          <ErrorsField/>
        </AutoForm>
        <p style={{ marginTop: '20px' }}>Or select a picture file to upload: <Button onClick={handleUploadClick}>Select
                    picture</Button></p>
      </Modal.Content>
    </Modal>
  );
};
