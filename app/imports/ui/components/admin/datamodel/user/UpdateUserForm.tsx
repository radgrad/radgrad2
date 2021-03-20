import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, BoolField, NumField, SelectField, SubmitField, LongTextField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { AdminProfiles } from '../../../../../api/user/AdminProfileCollection';
import { AcademicTerm, BaseProfile, CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import { ROLE } from '../../../../../api/role/Role';
import {
  academicTermIdToName,
  academicTermToName,
  careerGoalIdToName,
  courseToName,
  docToName,
  interestIdToName,
} from '../../../shared/utilities/data-model';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';
import { FacultyProfiles } from '../../../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../../../api/user/AdvisorProfileCollection';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import { openCloudinaryWidget } from '../../../shared/OpenCloudinaryWidget';
import { cloudinaryActions } from '../../../../../redux/shared/cloudinary';
import { ProfileInterests } from '../../../../../api/user/profile-entries/ProfileInterestCollection';
import { ProfileCareerGoals } from '../../../../../api/user/profile-entries/ProfileCareerGoalCollection';

interface UpdateUserProps {
  courses: Course[];
  opportunities: Opportunity[];
  interests: Interest[];
  careerGoals: CareerGoal[];
  academicTerms: AcademicTerm[];
  id: string;
  formRef: React.RefObject<unknown>;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
  setAdminDataModelUsersIsCloudinaryUsed: (isCloudinaryUsed: boolean) => any;
  setAdminDataModelUsersCloudinaryUrl: (cloudinaryUrl: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  setAdminDataModelUsersIsCloudinaryUsed: (isCloudinaryUsed: boolean) => dispatch(cloudinaryActions.setAdminDataModelUsersIsCloudinaryUsed(isCloudinaryUsed)),
  setAdminDataModelUsersCloudinaryUrl: (cloudinaryUrl: string) => dispatch(cloudinaryActions.setAdminDataModelUsersCloudinaryUrl(cloudinaryUrl)),
});

const UpdateUserForm: React.FC<UpdateUserProps> = ({ id, interests, setAdminDataModelUsersIsCloudinaryUsed, setAdminDataModelUsersCloudinaryUrl, careerGoals, academicTerms, formRef, itemTitleString, handleCancel, handleUpdate, courses, opportunities }) => {
  // console.log('UpdateUserForm', props);
  let collection;
  if (StudentProfiles.isDefined(id)) {
    collection = StudentProfiles;
  }
  if (FacultyProfiles.isDefined(id)) {
    collection = FacultyProfiles;
  }
  if (AdvisorProfiles.isDefined(id)) {
    collection = AdvisorProfiles;
  }
  if (AdminProfiles.isDefined(id)) {
    collection = AdminProfiles;
  }
  const profile: BaseProfile = collection.findDoc(id);
  const [pictureURL, setPictureURL] = useState(profile.picture);

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

  const model = collection.findDoc(id);
  const userID = model.userID;
  const favInterests = ProfileInterests.find({ userID }).fetch();
  const favInterestIDs = favInterests.map((fav) => fav.interestID);
  model.interests = favInterestIDs.map(interestIdToName);
  const favCareerGoals = ProfileCareerGoals.find({ userID }).fetch();
  const favCareerGoalIDs = favCareerGoals.map((fav) => fav.careerGoalID);
  model.careerGoals = favCareerGoalIDs.map(careerGoalIdToName);
  if (model.declaredAcademicTermID) {
    model.declaredAcademicTerm = academicTermIdToName(model.declaredAcademicTermID);
  }
  const interestNames = interests.map(docToName);
  const careerGoalNames = careerGoals.map(docToName);
  const academicTermNames = academicTerms.map(academicTermToName);
  const courseNames = courses.map(courseToName);
  const opportunityNames = opportunities.map(docToName);
  const schema = new SimpleSchema({
    username: { type: String, optional: true },
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
  });
  const studentSchema = new SimpleSchema({
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
  if (model.role === ROLE.STUDENT || model.role === ROLE.ALUMNI) {
    schema.extend(studentSchema);
  }
  const facultySchema = new SimpleSchema({
    aboutMe: { type: String, optional: true },
  });
  if (model.role === ROLE.FACULTY) {
    schema.extend(facultySchema);
  }
  const formSchema = new SimpleSchema2Bridge(schema);
  // console.log(schema);
  return (
    <Segment padded>
      <Header dividing>
        Update
        {collection.getType()}:{itemTitleString(model)}
      </Header>
      <AutoForm schema={formSchema} onSubmit={handleUpdate} ref={formRef} showInlineError model={model}>
        <Form.Group widths="equal">
          <TextField name="username" placeholder="johndoe@foo.edu" />
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
        {model.role === ROLE.STUDENT || model.role === ROLE.ALUMNI ? (
          <div>
            <Header dividing as="h4">
              Student fields
            </Header>
            <Form.Group widths="equal">
              <MultiSelectField name="courses" />
              <MultiSelectField name="opportunities" />
            </Form.Group>
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
        {model.role === ROLE.FACULTY ? (
          <div>
            <Header dividing as="h4">
              Faculty field
            </Header>
            <LongTextField name="aboutMe" />
          </div>
        ) : (
          ''
        )}
        <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
        <Button onClick={handleCancel}>Cancel</Button>
      </AutoForm>
    </Segment>
  );
};

const UpdateUserFormCon = connect(null, mapDispatchToProps)(UpdateUserForm);
export default UpdateUserFormCon;
