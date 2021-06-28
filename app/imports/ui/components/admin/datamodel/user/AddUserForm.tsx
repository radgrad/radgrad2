import _ from 'lodash';
import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import {
  AutoForm,
  TextField,
  SelectField,
  BoolField,
  LongTextField,
  NumField,
  SubmitField,
  ErrorsField,
} from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../../../api/base/BaseCollection.methods';
import { AdvisorProfiles } from '../../../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../../../api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';
import { AcademicTerm, CareerGoal, CombinedProfileDefine, Interest } from '../../../../../typings/radgrad';
import { ROLE } from '../../../../../api/role/Role';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import PictureField from '../../../form-fields/PictureField';
import { academicTermToName, docToName } from '../../../shared/utilities/data-model';
import MultiSelectField from '../../../form-fields/MultiSelectField';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import {
  careerGoalSlugFromName,
  declaredAcademicTermSlugFromName,
  interestSlugFromName,
} from '../../../shared/utilities/form';

interface AddUserProps {
  interests: Interest[];
  careerGoals: CareerGoal[];
  academicTerms: AcademicTerm[];
}

const AddUserForm: React.FC<AddUserProps> = ({ interests, academicTerms, careerGoals }) => {
  const [role, setRole] = useState<string>('');
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
    // console.log(collectionName, definitionData);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => { RadGradAlert.failure('Add failed', error.message, error);})
      .then(() => {
        RadGradAlert.success('Add succeeded');
      });
  };

  const handleModelChange = (model) => {
    setRole(model.role);
  };

  // Hacky way of resetting pictureURL to be empty
  const handleAddUser = (doc, fRef) => {
    fRef.reset();
    handleAdd(doc);
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
      <AutoForm schema={formSchema} ref={(ref) => formRef = ref} onSubmit={doc => handleAddUser(doc, formRef)}
        showInlineError onChangeModel={handleModelChange}>
        <Form.Group widths="equal">
          <TextField id={COMPONENTIDS.DATA_MODEL_USERNAME} name="username" placeholder="johndoe@foo.edu" />
          <SelectField id={COMPONENTIDS.DATA_MODEL_ROLE} name="role" />
        </Form.Group>
        <Form.Group widths="equal">
          <TextField id={COMPONENTIDS.DATA_MODEL_FIRST_NAME} name="firstName" placeholder="John" />
          <TextField id={COMPONENTIDS.DATA_MODEL_LAST_NAME} name="lastName" placeholder="Doe" />
        </Form.Group>
        <Header dividing as="h4">
          Optional fields (all users)
        </Header>
        <Form.Group widths="equal">
          <PictureField id={COMPONENTIDS.DATA_MODEL_PICTURE} name="picture" />
          <TextField id={COMPONENTIDS.DATA_MODEL_WEBSITE} name="website" />
        </Form.Group>
        <Form.Group widths="equal">
          <MultiSelectField id={COMPONENTIDS.DATA_MODEL_INTERESTS} name="interests" />
          <MultiSelectField id={COMPONENTIDS.DATA_MODEL_CAREER_GOALS} name="careerGoals" />
        </Form.Group>
        <BoolField id={COMPONENTIDS.DATA_MODEL_RETIRED} name="retired" />
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
        <SubmitField id={COMPONENTIDS.DATA_MODEL_SUBMIT} className="mini basic green" value="Add" disabled={false} inputRef={undefined} />
        <ErrorsField id={COMPONENTIDS.DATA_MODEL_ERROR_FIELD} />
      </AutoForm>
    </Segment>
  );
};

export default AddUserForm;
