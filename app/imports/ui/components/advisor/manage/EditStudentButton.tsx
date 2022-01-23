import React, { useState } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, ErrorsField, NumField, SubmitField, TextField } from 'uniforms-semantic';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { StudentProfileUpdate } from '../../../../typings/radgrad';
import MultiSelectField from '../../form-fields/MultiSelectField';
import PictureField from '../../form-fields/PictureField';
import { ButtonAction } from '../../shared/button/ButtonAction';
import { ManageStudentProps } from './ManageStudentProps';

const EditStudentButton: React.FC<ManageStudentProps> = ({
  student,
  careerGoals,
  courses,
  interests,
  opportunities,
  profileCareerGoals,
  profileInterests,
}) => {
  const [open, setOpen] = useState(false);

  // console.log(student, careerGoals, courses, interests, opportunities, profileCareerGoals, profileCourses, profileInterests, profileOpportunities);
  // console.log(student);
  const model: StudentProfileUpdate = student;
  model.interests = profileInterests.map((p) => Interests.findDoc(p.interestID).name);
  model.careerGoals = profileCareerGoals.map((p) => CareerGoals.findDoc(p.careerGoalID).name);
  const careerGoalNames = careerGoals.map((cg) => cg.name);
  const interestNames = interests.map((i) => i.name);

  const handleSubmit = (doc) => {
    // console.log('handleSubmit', doc);
    const collectionName = StudentProfiles.getCollectionName();
    const updateData = doc;
    updateData.id = doc._id;
    // update names to slugs
    updateData.interests = doc.interests.map((name) => Interests.findSlugByID(name));
    updateData.careerGoals = doc.careerGoals.map((name) => CareerGoals.findSlugByID(name));
    // updateData.profileCourses = doc.profileCourses.map((name) => Courses.findSlugByID(name));
    // updateData.profileOpportunities = doc.profileOpportunities.map((name) => Opportunities.findSlugByID(name));
    // console.log(collectionName, updateData);
    updateMethod.callPromise({ collectionName, updateData })
      .then(() => { RadGradAlert.success('Student Updated');})
      .catch((error) => { RadGradAlert.failure('Update Failed', error.message, error);});
  };

  const updateStudentSchema = new SimpleSchema({
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
    picture: { type: String, optional: true },
    website: { type: String, optional: true },
    interests: { type: Array, optional: true },
    'interests.$': {
      type: String,
      allowedValues: interestNames,
    },
    careerGoals: { type: Array, optional: true },
    'careerGoals.$': {
      type: String,
      allowedValues: careerGoalNames,
    },
    retired: { type: Boolean, optional: true },
    level: { type: SimpleSchema.Integer, optional: true, min: 1, max: 6 },
    sharePicture: { type: Boolean, optional: true },
    shareWebsite: { type: Boolean, optional: true },
    shareInterests: { type: Boolean, optional: true },
    shareCareerGoals: { type: Boolean, optional: true },
    shareOpportunities: { type: Boolean, optional: true },
    shareCourses: { type: Boolean, optional: true },
    shareLevel: { type: Boolean, optional: true },
    shareICE: { type: Boolean, optional: true },
    isAlumni: { type: Boolean, optional: true },
  });
  const updateStudentFormSchema = new SimpleSchema2Bridge(updateStudentSchema);

  // console.log(model);
  return (
    <Modal key={`${student._id}-modal`}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<ButtonAction color='green' key={`${student._id}-edit-button`} size='mini'
        onClick={() => setOpen(true)} icon='edit' label='edit' id={`${student._id}-edit-button`} />}
    >
      <Modal.Header>{`Edit ${student.firstName} ${student.lastName}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={model} schema={updateStudentFormSchema} onSubmit={(doc) => {
          handleSubmit(doc);
          setOpen(false);
        }}>
          <Form.Group widths="equal">
            <TextField name="firstName" placeholder="John"/>
            <TextField name="lastName" placeholder="Doe"/>
          </Form.Group>
          <Form.Group widths="equal">
            <PictureField name="picture" iconLeft='user'/>
            <TextField name="website"/>
          </Form.Group>
          <Form.Group widths="equal">
            <MultiSelectField name="interests"/>
            <MultiSelectField name="careerGoals"/>
          </Form.Group>
          <Form.Group widths="equal">
            <NumField name="level"/>
            <BoolField name="retired"/>
          </Form.Group>
          <Form.Group widths="equal">
            <BoolField name="sharePicture"/>
            <BoolField name="shareWebsite"/>
            <BoolField name="shareInterests"/>
            <BoolField name="shareCareerGoals"/>
          </Form.Group>
          <Form.Group>
            <BoolField name="shareOpportunities"/>
            <BoolField name="shareCourses"/>
            <BoolField name="shareLevel"/>
            <BoolField name="shareICE"/>
            <BoolField name="isAlumni"/>
          </Form.Group>
          <SubmitField/>
          <Button color='red' onClick={() => setOpen(false)}>
                        Cancel
          </Button>
          <ErrorsField/>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

export default EditStudentButton;
