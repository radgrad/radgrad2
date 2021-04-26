import _ from 'lodash';
import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, SelectField, BoolField, LongTextField, NumField, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { AdvisorProfiles } from '../../../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../../../api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';
import { AcademicTerm, CareerGoal, CombinedProfileDefine, Interest } from '../../../../../typings/radgrad';
import { ROLE } from '../../../../../api/role/Role';
import { academicTermToName, docToName } from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../../../shared/OpenCloudinaryWidget';
import { cloudinaryActions } from '../../../../../redux/shared/cloudinary';
import {
  careerGoalSlugFromName,
  declaredAcademicTermSlugFromName,
  interestSlugFromName,
} from '../../../shared/utilities/form';
import { defineCallback } from '../utilities/add-form';

interface AddUserProps {
  interests: Interest[];
  careerGoals: CareerGoal[];
  academicTerms: AcademicTerm[];
  isCloudinaryUsed: boolean;
  cloudinaryUrl: string;
  setAdminDataModelUsersIsCloudinaryUsed: (isCloudinaryUsed: boolean) => any;
  setAdminDataModelUsersCloudinaryUrl: (cloudinaryUrl: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  setAdminDataModelUsersIsCloudinaryUsed: (isCloudinaryUsed: boolean) => dispatch(cloudinaryActions.setAdminDataModelUsersIsCloudinaryUsed(isCloudinaryUsed)),
  setAdminDataModelUsersCloudinaryUrl: (cloudinaryUrl: string) => dispatch(cloudinaryActions.setAdminDataModelUsersCloudinaryUrl(cloudinaryUrl)),
});

const AddUserForm: React.FC<AddUserProps> = ({ interests, academicTerms, careerGoals, isCloudinaryUsed, cloudinaryUrl, setAdminDataModelUsersCloudinaryUrl, setAdminDataModelUsersIsCloudinaryUsed }) => {
  const [role, setRole] = useState<string>('');
  const [pictureURL, setPictureURL] = useState<string>('');

  let formRef;

  const handleAdd = (doc: CombinedProfileDefine) => {
    // console.log('handleAdd(%o)', doc);
    const definitionData: CombinedProfileDefine = doc;
    if (doc.interests) {
      definitionData.interests = doc.interests.map((interest) => interestSlugFromName(interest));
    } else {
      definitionData.interests = [];
    }
    if (doc.careerGoals) {
      definitionData.careerGoals = doc.careerGoals.map((goal) => careerGoalSlugFromName(goal));
    } else {
      definitionData.careerGoals = [];
    }
    if (!_.isNil(doc.declaredAcademicTerm)) {
      definitionData.declaredAcademicTerm = declaredAcademicTermSlugFromName(doc.declaredAcademicTerm);
    }
    let collectionName = StudentProfiles.getCollectionName();
    if (doc.role === ROLE.ADVISOR) {
      collectionName = AdvisorProfiles.getCollectionName();
    } else if (doc.role === ROLE.FACULTY) {
      collectionName = FacultyProfiles.getCollectionName();
    } else if (doc.role === ROLE.STUDENT) {
      if (_.isNil(doc.level)) {
        definitionData.level = 1;
      }
    }
    if (isCloudinaryUsed) {
      definitionData.picture = cloudinaryUrl;
    }
    // console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, defineCallback(formRef));
  };


  const handleModelChange = (model) => {
    setRole(model.role);
  };

  const handleUpload = async (e): Promise<void> => {
    e.preventDefault();
    try {
      const cloudinaryResult = await openCloudinaryWidget();
      if (cloudinaryResult.event === 'success') {
        setAdminDataModelUsersIsCloudinaryUsed(true);
        setAdminDataModelUsersCloudinaryUrl(cloudinaryResult.info.secure_url);
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

  const handlePictureUrlChange = (value) => {
    setPictureURL(value);
  };

  // Hacky way of resetting pictureURL to be empty
  const handleAddUser = (doc) => {
    handleAdd(doc);
    setPictureURL('');
  };

  const interestNames = interests.map(docToName);
  const careerGoalNames = careerGoals.map(docToName);
  const academicTermNames = academicTerms.map(academicTermToName);
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
  });
  const studentSchema = new SimpleSchema({
    level: { type: SimpleSchema.Integer, optional: true, min: 1, max: 6 },
    declaredAcademicTerm: {
      type: String,
      optional: true,
      allowedValues: academicTermNames,
    },
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
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} onSubmit={(doc) => handleAddUser(doc)} ref={(ref) => formRef = ref} showInlineError onChangeModel={handleModelChange}>
        <Form.Group widths="equal">
          <TextField name="username" placeholder="johndoe@foo.edu" />
          <SelectField name="role" />
        </Form.Group>
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
          <MultiSelectField name="interests" />
          <MultiSelectField name="careerGoals" />
        </Form.Group>
        <BoolField name="retired" />
        {role === ROLE.STUDENT ? (
          <div>
            <Header dividing as="h4">
              Student fields
            </Header>
            <Form.Group widths="equal">
              <NumField name="level" />
              <SelectField name="declaredAcademicTerm" />
            </Form.Group>
            <Form.Group widths="equal">
              <BoolField name="sharePicture" />
              <BoolField name="shareWebsite" />
              <BoolField name="shareInterests" />
              <BoolField name="shareCareerGoals" />
              <BoolField name="shareOpportunities" />
              <BoolField name="shareCourses" />
              <BoolField name="shareLevel" />
              <BoolField name="shareICE" />
              <BoolField name="isAlumni" />
            </Form.Group>
          </div>
        ) : (
          ''
        )}
        {role === ROLE.FACULTY ? (
          <div>
            <Header dividing as="h4">
              Faculty field
            </Header>
            <LongTextField name="aboutMe" />
          </div>
        ) : (
          ''
        )}
        <SubmitField className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
      </AutoForm>
    </Segment>
  );
};

export default connect(null, mapDispatchToProps)(AddUserForm);
