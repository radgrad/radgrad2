import React, { useState } from 'react';
import { Button, Form, Header, Modal } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, NumField, SelectField, TextField } from 'uniforms-semantic';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../../api/role/Role';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import MultiSelectField from '../../form-fields/MultiSelectField';
import { ManageStudentProps } from './ManageStudentProps';

const EditStudentButton: React.FC<ManageStudentProps> = ({ student }) => {
  const [open, setOpen] = useState(false);

  const model = StudentProfiles.dumpOne(student._id);

  const updateStudentSchema = StudentProfiles.getUpdateSchema();
  const updateStudentFormSchema = new SimpleSchema2Bridge(updateStudentSchema);

  const handleUpdate = (doc) => {
    console.log('handleUpdate', doc);
    const collectionName = StudentProfiles.getCollectionName();
    const updateData = doc;
    updateData.id = student._id;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update Failed',
          text: error.message,
          icon: 'error',
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: 'Review Updated',
          icon: 'success',
          text: 'Your review was successfully updated.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setOpen(false);
    });
  };
  const [pictureURL, setPictureURL] = useState(student.picture);
  const handlePictureUrlChange = (value) => {
    setPictureURL(value);
  };
  console.log(model);
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button basic color='green'>EDIT</Button>}
    >
      <Modal.Header>{`Edit ${student.firstName} ${student.lastName}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={model} schema={updateStudentFormSchema} showInlineError onSubmit={handleUpdate}>
          <Form.Group widths="equal">
            <TextField name="firstName" placeholder="John" />
            <TextField name="lastName" placeholder="Doe" />
          </Form.Group>
          <Header dividing as="h4">
            Optional fields (all users)
          </Header>
          <Form.Group widths="equal">
            <TextField name="picture" value={pictureURL} onChange={handlePictureUrlChange} />
            <TextField name="website" />
          </Form.Group>
          <Form.Group widths="equal">
             {/* <MultiSelectField name="interests" /> */}
            {/* <MultiSelectField name="careerGoals" /> */}
          </Form.Group>
          <BoolField name="retired" />
          <Header dividing as="h4">
            Student fields
          </Header>
          <Form.Group widths="equal">
            {/* <MultiSelectField name="profileCourses" /> */}
            {/* <MultiSelectField name="profileOpportunities" /> */}
          </Form.Group>
          <Form.Group widths="equal">
            <NumField name="level" />
            {/* <SelectField name="declaredAcademicTerm" /> */}
          </Form.Group>
          <Form.Group widths="equal">
            <BoolField name="sharePicture" />
            <BoolField name="shareWebsite" />
            <BoolField name="shareInterests" />
            <BoolField name="shareCareerGoals" />
          </Form.Group>
          <Form.Group>
            <BoolField name="shareOpportunities" />
            <BoolField name="shareCourses" />
            <BoolField name="shareLevel" />
            <BoolField name="shareICE" />
            <BoolField name="isAlumni" />
          </Form.Group>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

export default EditStudentButton;
