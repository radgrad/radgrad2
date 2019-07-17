import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import BoolField from 'uniforms-semantic/BoolField';
import LongTextField from 'uniforms-semantic/LongTextField';
import NumberField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import TextField from 'uniforms-semantic/TextField';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { Interests } from '../../../api/interest/InterestCollection';
import { IAcademicPlan, IAcademicTerm, ICareerGoal, IInterest } from '../../../typings/radgrad'; // eslint-disable-line
import BaseCollection from '../../../api/base/BaseCollection'; // eslint-disable-line
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { ROLE } from '../../../api/role/Role';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import {
  academicPlanIdToName, academicTermIdToName,
  academicTermToName,
  careerGoalIdToName,
  docToName,
  interestIdToName,
} from '../shared/AdminDataModelHelperFunctions';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import MultiSelectField from '../shared/MultiSelectField';

interface IUpdateUserProps {
  interests: IInterest[];
  careerGoals: ICareerGoal[];
  academicTerms: IAcademicTerm[];
  academicPlans: IAcademicPlan[];
  collection: BaseCollection;
  id: string;
  formRef: any;
  handleUpdate: (doc) => any;
  handleCancel: (event) => any;
  itemTitleString: (item) => React.ReactNode;
}

class UpdateUserForm extends React.Component<IUpdateUserProps> {
  constructor(props) {
    super(props);
    // console.log('UpdateUserForm props=%o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    // console.log(this.props);
    const id = this.props.id;
    let collection;
    if (StudentProfiles.isDefined(id)) {
      collection = StudentProfiles;
    }
    if (FacultyProfiles.isDefined(id)) {
      collection = FacultyProfiles;
    }
    if (MentorProfiles.isDefined(id)) {
      collection = MentorProfiles;
    }
    if (AdvisorProfiles.isDefined(id)) {
      collection = AdvisorProfiles;
    }
    const model = collection.findDoc(id);
    model.interests = _.map(model.interestIDs, interestIdToName);
    model.careerGoals = _.map(model.careerGoalIDs, careerGoalIdToName);
    if (model.academicPlanID) {
      model.academicPlan = academicPlanIdToName(model.academicPlanID);
    }
    if (model.declaredAcademicTermID) {
      model.declaredAcademicTerm = academicTermIdToName(model.declaredAcademicTermID);
    }
    // console.log(model);
    const interestNames = _.map(this.props.interests, docToName);
    const careerGoalNames = _.map(this.props.careerGoals, docToName);
    const academicTermNames = _.map(this.props.academicTerms, academicTermToName);
    const academicPlanNames = _.map(this.props.academicPlans, docToName);
    // console.log(academicTermNames);
    const schema = new SimpleSchema({
      username: { type: String, optional: true },
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
    });
    const mentorSchema = new SimpleSchema({
      company: { type: String, optional: true },
      career: { type: String, optional: true },
      location: { type: String, optional: true },
      linkedin: { type: String, optional: true },
      motivation: { type: String, optional: true },
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
    if (model.role === ROLE.MENTOR) {
      schema.extend(mentorSchema);
    }
    if (model.role === ROLE.STUDENT || model.role === ROLE.ALUMNI) {
      schema.extend(studentSchema);
    }
    // console.log(schema);
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm schema={schema} onSubmit={this.props.handleUpdate} ref={this.props.formRef}
                  showInlineError={true} model={model}>
          <Form.Group widths="equal">
            <TextField name="username" placeholder="johndoe@foo.edu"/>
            <TextField name="firstName" placeholder="John"/>
            <TextField name="lastName" placeholder="Doe"/>
          </Form.Group>
          <Header dividing={true} as="h4">Optional fields (all users)</Header>
          <Form.Group widths="equal">
            <TextField name="picture" placeholder="http://johndoe.github.io/images/johndoe.jpg"/>
            <TextField name="website" placeholder="http://johndoe.github.io/"/>
          </Form.Group>
          <Form.Group widths="equal">
            <MultiSelectField name="interests"/>
            <MultiSelectField name="careerGoals"/>
          </Form.Group>
          <BoolField name="retired"/>
          {model.role === ROLE.MENTOR ? (
            <div>
              <Header dividing={true} as="h4">Mentor fields</Header>
              <Form.Group widths="equal">
                <TextField name="company"/>
                <TextField name="career" label="Title"/>
              </Form.Group>
              <Form.Group widths="equal">
                <TextField name="location"/>
                <TextField name="linkedin" label="LinkedIn"/>
              </Form.Group>
              <LongTextField name="motivation"/>
            </div>
          ) : ''}
          {model.role === ROLE.STUDENT || model.role === ROLE.ALUMNI ? (
            <div>
              <Header dividing={true} as="h4">Student fields</Header>
              <Form.Group widths="equal">
                <NumberField name="level"/>
                <SelectField name="declaredAcademicTerm"/>
                <SelectField name="academicPlan"/>
              </Form.Group>
              <Form.Group widths="equal">
                <BoolField name="shareUsername"/>
                <BoolField name="sharePicture"/>
                <BoolField name="shareWebsite"/>
                <BoolField name="shareInterests"/>
                <BoolField name="shareCareerGoals"/>
                <BoolField name="shareAcademicPlan"/>
                <BoolField name="shareOpportunities"/>
                <BoolField name="shareCourses"/>
                <BoolField name="shareLevel"/>
                <BoolField name="isAlumni"/>
              </Form.Group>
            </div>
          ) : ''}
          <SubmitField/>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
        </AutoForm>
      </Segment>
    );
  }
}

const UpdateUserFormContainter = withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  const academicTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  // console.log(academicTerms, currentTerm);
  const academicPlans = AcademicPlans.getLatestPlans();
  return {
    interests,
    careerGoals,
    academicTerms,
    academicPlans,
  };
})(UpdateUserForm);

export default UpdateUserFormContainter;
