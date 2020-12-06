import React, { useState } from 'react';
import _ from 'lodash';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, BoolField, LongTextField, NumField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { IAcademicPlan, IAcademicTerm, ICareerGoal, IInterest } from '../../../../../typings/radgrad';
import { ROLE } from '../../../../../api/role/Role';
import { academicTermToName, docToName } from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../../../shared/OpenCloudinaryWidget';
import { cloudinaryActions } from '../../../../../redux/shared/cloudinary';

interface IAddUserProps {
  interests: IInterest[];
  careerGoals: ICareerGoal[];
  academicTerms: IAcademicTerm[];
  academicPlans: IAcademicPlan[];
  formRef: React.RefObject<unknown>;
  handleAdd: (doc) => any;
  setAdminDataModelUsersIsCloudinaryUsed: (isCloudinaryUsed: boolean) => any;
  setAdminDataModelUsersCloudinaryUrl: (cloudinaryUrl: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  setAdminDataModelUsersIsCloudinaryUsed: (isCloudinaryUsed: boolean) => dispatch(cloudinaryActions.setAdminDataModelUsersIsCloudinaryUsed(isCloudinaryUsed)),
  setAdminDataModelUsersCloudinaryUrl: (cloudinaryUrl: string) => dispatch(cloudinaryActions.setAdminDataModelUsersCloudinaryUrl(cloudinaryUrl)),
});

const AddUserForm: React.FC<IAddUserProps> = ({ interests, handleAdd, formRef, academicTerms, careerGoals, academicPlans, setAdminDataModelUsersCloudinaryUrl, setAdminDataModelUsersIsCloudinaryUsed }) => {
  const [role, setRole] = useState<string>('');
  const [pictureURL, setPictureURL] = useState<string>('');

  const handleModelChange = (model) => {
    setRole(model.role);
  };

  const handleUpload = async (e): Promise<void> => {
    e.preventDefault();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        setAdminDataModelUsersIsCloudinaryUsed(true);
        setAdminDataModelUsersCloudinaryUrl(cloudinaryResult.info.url);
        setPictureURL(cloudinaryResult.info.url);
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

  const handlePictureUrlChange = (value) => {
    setPictureURL(value);
  };

  // Hacky way of resetting pictureURL to be empty
  const handleAddUser = (doc) => {
    handleAdd(doc);
    setPictureURL('');
  };

  const interestNames = _.map(interests, docToName);
  const careerGoalNames = _.map(careerGoals, docToName);
  const academicTermNames = _.map(academicTerms, academicTermToName);
  const academicPlanNames = _.map(academicPlans, docToName);
  const roles = [ROLE.ADVISOR, ROLE.FACULTY, ROLE.STUDENT];
  const schema = new SimpleSchema({
    username: String,
    firstName: String,
    lastName: String,
    role: {
      type: String,
      allowedValues: roles,
      defaultValue: roles[3],
    },
    picture: {
      type: String,
      label:
  <React.Fragment>
    Picture (
    <button type="button" onClick={handleUpload}>Upload</button>
    )
  </React.Fragment>,
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
  });
  const studentSchema = new SimpleSchema({
    level: { type: SimpleSchema.Integer, optional: true, min: 1, max: 6 },
    declaredAcademicTerm: {
      type: String,
      optional: true,
      allowedValues: academicTermNames,
    },
    academicPlan: {
      type: String,
      optional: true,
      allowedValues: academicPlanNames,
    },
    shareUsername: { type: Boolean, optional: true },
    sharePicture: { type: Boolean, optional: true },
    shareWebsite: { type: Boolean, optional: true },
    shareInterests: { type: Boolean, optional: true },
    shareCareerGoals: { type: Boolean, optional: true },
    shareAcademicPlan: { type: Boolean, optional: true },
    shareOpportunities: { type: Boolean, optional: true },
    shareCourses: { type: Boolean, optional: true },
    shareLevel: { type: Boolean, optional: true },
    isAlumni: { type: Boolean, optional: true },
  });
  if (role === ROLE.STUDENT) {
    schema.extend(studentSchema);
  }
  const facultySchema = new SimpleSchema({
    aboutMe: { type: String, optional: true },
  });
  if (role === ROLE.FACULTY) {
    schema.extend(facultySchema);
  }
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Segment padded>
      <Header dividing>Add User</Header>
      <AutoForm
        schema={formSchema}
        onSubmit={(doc) => handleAddUser(doc)}
        ref={formRef}
        showInlineError
        onChangeModel={handleModelChange}
      >
        <Form.Group widths="equal">
          <TextField name="username" placeholder="johndoe@foo.edu" />
          <SelectField name="role" />
        </Form.Group>
        <Form.Group widths="equal">
          <TextField name="firstName" placeholder="John" />
          <TextField name="lastName" placeholder="Doe" />
        </Form.Group>
        <Header dividing as="h4">Optional fields (all users)</Header>
        <Form.Group widths="equal">
          <TextField name="picture" value={pictureURL} onChange={handlePictureUrlChange} />
          <TextField name="website" />
        </Form.Group>
        <Form.Group widths="equal">
          <MultiSelectField name="interests" />
          <MultiSelectField name="careerGoals" />
        </Form.Group>
        <BoolField name="retired" />
        {role === ROLE.STUDENT ? (
          <div>
            <Header dividing as="h4">Student fields</Header>
            <Form.Group widths="equal">
              <NumField name="level" />
              <SelectField name="declaredAcademicTerm" />
              <SelectField name="academicPlan" />
            </Form.Group>
            <Form.Group widths="equal">
              <BoolField name="shareUsername" />
              <BoolField name="sharePicture" />
              <BoolField name="shareWebsite" />
              <BoolField name="shareInterests" />
              <BoolField name="shareCareerGoals" />
              <BoolField name="shareAcademicPlan" />
              <BoolField name="shareOpportunities" />
              <BoolField name="shareCourses" />
              <BoolField name="shareLevel" />
              <BoolField name="isAlumni" />
            </Form.Group>
          </div>
        ) : ''}
        {role === ROLE.FACULTY ? (
          <div>
            <Header dividing as="h4">Faculty field</Header>
            <LongTextField name="aboutMe" />
          </div>
        ) : ''}
        <SubmitField className="basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

export default connect(null, mapDispatchToProps)(AddUserForm);
