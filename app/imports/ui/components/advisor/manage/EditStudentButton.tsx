import React, { useState } from 'react';
import { Button, Form, Grid, Header, Modal } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, BoolField, NumField, SubmitField, TextField } from 'uniforms-semantic';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import MultiSelectField from '../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../../shared/OpenCloudinaryWidget';
import { ManageStudentProps } from './ManageStudentProps';

const EditStudentButton: React.FC<ManageStudentProps> = ({
  student,
  careerGoals,
  courses,
  interests,
  opportunities,
  profileCareerGoals,
  profileCourses,
  profileInterests,
  profileOpportunities,
}) => {
  const [open, setOpen] = useState(false);

  // console.log(student, careerGoals, courses, interests, opportunities, profileCareerGoals, profileCourses, profileInterests, profileOpportunities);
  const model: any = student;
  model.interests = profileInterests.map((p) => Interests.findDoc(p.interestID).name);
  model.careerGoals = profileCareerGoals.map((p) => CareerGoals.findDoc(p.careerGoalID).name);
  model.courses = profileCourses.map((p) => Courses.toString(p.courseID));
  model.opportunities = profileOpportunities.map((p) => Opportunities.findDoc(p.opportunityID).name);
  const careerGoalNames = careerGoals.map((cg) => cg.name);
  const courseNames = courses.map((c) => Courses.toString(c._id));
  const interestNames = interests.map((i) => i.name);
  const opportunityNames = opportunities.map((o) => o.name);
  const handleUpload = async (e): Promise<void> => {
    e.preventDefault();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        setPictureURL(cloudinaryResult.info.secure_url);
      }
    } catch (error) {
      Swal.fire({
        title: 'Failed to Upload Photo',
        icon: 'error',
        text: error.statusText,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };

  const updateStudentSchema = new SimpleSchema({
    firstName: { type: String, optional: true },
    lastName: { type: String, optional: true },
    picture: {
      type: String,
      label: (
        <React.Fragment>
          Picture (
          <button type="button" onClick={handleUpload}>
            Upload
          </button>
          )
        </React.Fragment>
      ),
      optional: true,
    },
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
    courses: { type: Array, optional: true },
    'courses.$': {
      type: String,
      allowedValues: courseNames,
    },
    opportunities: { type: Array, optional: true },
    'opportunities.$': {
      type: String,
      allowedValues: opportunityNames,
    },
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

  const handleSubmit = (doc) => {
    console.log('handleUpdate', doc);
    const collectionName = StudentProfiles.getCollectionName();
    const updateData = doc;
    updateData.id = student._id;
    // update names to slugs
    updateData.interests = doc.interests.map((name) => Interests.findSlugByID(name));
    updateData.careerGoals = doc.careerGoals.map((name) => CareerGoals.findSlugByID(name));
    updateData.courses = doc.courses.map((name) => Courses.findSlugByID(name));
    updateData.opportunities = doc.opportunities.map((name) => Opportunities.findSlugByID(name));
    console.log(collectionName, updateData);
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
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button basic color='green'>EDIT</Button>}
    >
      <Modal.Header>{`Edit ${student.firstName} ${student.lastName}`}</Modal.Header>
      <Modal.Content>
        <AutoForm model={model} schema={updateStudentFormSchema} onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <TextField name="firstName" placeholder="John" />
            <TextField name="lastName" placeholder="Doe" />
          </Form.Group>
          <Form.Group widths="equal">
            <TextField name="picture" value={pictureURL} onChange={handlePictureUrlChange} />
            <TextField name="website" />
          </Form.Group>
          <Form.Group widths="equal">
            <MultiSelectField name="interests" />
            <MultiSelectField name="careerGoals" />
          </Form.Group>
          <Form.Group widths="equal">
            <MultiSelectField name="courses" />
            <MultiSelectField name="opportunities" />
          </Form.Group>
          <Form.Group widths="equal">
            <NumField name="level" />
            <BoolField name="retired" />
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
          <SubmitField />
          <Button color='red' onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

export default EditStudentButton;
