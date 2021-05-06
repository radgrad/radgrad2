import React from 'react';
import { Tab, Header, Form } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, BoolField, ErrorsField, NumField, SubmitField, TextField } from 'uniforms-semantic';
import { defineMethod } from '../../../../api/base/BaseCollection.methods';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import { CareerGoal, CombinedProfileDefine, Interest } from '../../../../typings/radgrad';
import MultiSelectField from '../../form-fields/MultiSelectField';
import PictureField from '../../form-fields/PictureField';
import { docToName } from '../../shared/utilities/data-model';
import {
  careerGoalSlugFromName,
  interestSlugFromName,
} from '../../shared/utilities/form';

export interface AdvisorAddStudentWidgetProps {
  interests: Interest[];
  careerGoals: CareerGoal[];
}

const AdvisorAddStudentTab: React.FC<AdvisorAddStudentWidgetProps> = ({ interests, careerGoals }) => {

  const interestNames = interests.map(docToName);
  const careerGoalNames = careerGoals.map(docToName);
  let formRef;

  const schema = new SimpleSchema({
    username: String,
    firstName: String,
    lastName: String,
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
    level: { type: SimpleSchema.Integer, min: 1, max: 6, defaultValue: 1 },
    sharePicture: { type: Boolean, optional: true },
    shareWebsite: { type: Boolean, optional: true },
    shareInterests: { type: Boolean, optional: true },
    shareCareerGoals: { type: Boolean, optional: true },
    shareOpportunities: { type: Boolean, optional: true },
    shareCourses: { type: Boolean, optional: true },
    shareLevel: { type: Boolean, optional: true },
    shareICE: { type: Boolean, optional: true },
    isAlumni: { type: Boolean, optional: true },
    retired: { type: Boolean, optional: true },
  });

  const formSchema = new SimpleSchema2Bridge(schema);


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
    const collectionName = StudentProfiles.getCollectionName();
    formRef.reset();
    defineMethod.callPromise({ collectionName, definitionData })
      .then((result) => {
        Swal.fire({
          title: 'Add succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          icon: 'error',
        });
      });
  };
  return (
    <Tab.Pane key="new">
      <Header as="h4" dividing>
        ADD STUDENT
      </Header>
      {/* eslint-disable-next-line no-return-assign */}
      <AutoForm schema={formSchema} ref={(ref) => formRef = ref} onSubmit={(doc) => handleAdd(doc)} showInlineError>
        <TextField name="username" placeholder="johndoe@foo.edu" />
        <Form.Group widths="equal">
          <TextField name="firstName" placeholder="John" />
          <TextField name="lastName" placeholder="Doe" />
        </Form.Group>
        <Form.Group widths="equal">
          <PictureField name="picture" />
          <TextField name="website" />
        </Form.Group>
        <Form.Group widths="equal">
          <MultiSelectField name="interests" />
          <MultiSelectField name="careerGoals" />
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
          <BoolField name="shareOpportunities" />
          <BoolField name="shareCourses" />
          <BoolField name="shareLevel" />
          <BoolField name="shareICE" />
          <BoolField name="isAlumni" />
        </Form.Group>
        <ErrorsField />
        <SubmitField inputRef={undefined} disabled={false} value="Add" className="mini basic green" />
      </AutoForm>
    </Tab.Pane>
  );
};

export default AdvisorAddStudentTab;
