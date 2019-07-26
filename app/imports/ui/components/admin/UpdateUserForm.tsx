import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { connect } from 'react-redux';
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
import { IAcademicPlan, IAcademicTerm, IBaseProfile, ICareerGoal, IInterest } from '../../../typings/radgrad'; // eslint-disable-line
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
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import {
  SET_ADMIN_DATAMODEL_USERS_CLOUDINARY_URL,
  SET_ADMIN_DATAMODEL_USERS_IS_CLOUDINARY_USED,
} from '../../../redux/shared/cloudinary/types';
import { setCloudinaryUrl, setIsCloudinaryUsed } from '../../../redux/shared/cloudinary/actions';

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
  setIsCloudinaryUsed: (type: string, isCloudinaryUsed: boolean) => any;
  setCloudinaryUrl: (type: string, cloudinaryUrl: string) => any;
}

interface IUpdateUserState {
  pictureURL: string;
}

const mapDispatchToProps = (dispatch) => ({
  setIsCloudinaryUsed: (type: string, isCloudinaryUsed: boolean) => dispatch(setIsCloudinaryUsed(type, isCloudinaryUsed)),
  setCloudinaryUrl: (type: string, cloudinaryUrl: string) => dispatch(setCloudinaryUrl(type, cloudinaryUrl)),
});

class UpdateUserForm extends React.Component<IUpdateUserProps, IUpdateUserState> {
  constructor(props) {
    super(props);
    let collection;
    const { id } = props;
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
    const profile: IBaseProfile = collection.findDoc(id);
    this.state = {
      pictureURL: profile.picture,
    };
  }

  private handleUpload = async (e): Promise<void> => {
    e.preventDefault();
    const cloudinaryResult = await openCloudinaryWidget();
    if (cloudinaryResult.event === 'success') {
      this.props.setIsCloudinaryUsed(SET_ADMIN_DATAMODEL_USERS_IS_CLOUDINARY_USED, true);
      this.props.setCloudinaryUrl(SET_ADMIN_DATAMODEL_USERS_CLOUDINARY_URL, cloudinaryResult.info.url);
      this.setState({ pictureURL: cloudinaryResult.info.url });
    }
  }

  private handlePictureUrlChange = (value) => {
    this.setState({ pictureURL: value });
  }

  // Hacky way of resetting pictureURL to be empty
  private handleUpdateUser = (doc) => {
    this.props.handleUpdate(doc);
    this.setState({ pictureURL: '' });
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
    const interestNames = _.map(this.props.interests, docToName);
    const careerGoalNames = _.map(this.props.careerGoals, docToName);
    const academicTermNames = _.map(this.props.academicTerms, academicTermToName);
    const academicPlanNames = _.map(this.props.academicPlans, docToName);
    const schema = new SimpleSchema({
      username: { type: String, optional: true },
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      picture: {
        type: String,
        label: <React.Fragment>Picture (<a onClick={this.handleUpload}>Upload</a>)</React.Fragment>,
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
    const { pictureURL } = this.state;
    return (
      <Segment padded={true}>
        <Header dividing={true}>Update {collection.getType()}: {this.props.itemTitleString(model)}</Header>
        <AutoForm schema={schema} onSubmit={(doc) => this.handleUpdateUser(doc)} ref={this.props.formRef}
                  showInlineError={true} model={model}>
          <Form.Group widths="equal">
            <TextField name="username" placeholder="johndoe@foo.edu"/>
            <TextField name="firstName" placeholder="John"/>
            <TextField name="lastName" placeholder="Doe"/>
          </Form.Group>
          <Header dividing={true} as="h4">Optional fields (all users)</Header>
          <Form.Group widths="equal">
            <TextField name="picture" value={pictureURL} onChange={this.handlePictureUrlChange}/>
            <TextField name="website"/>
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

const UpdateUserFormCon = connect(null, mapDispatchToProps)(UpdateUserForm);
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
})(UpdateUserFormCon);

export default UpdateUserFormContainter;
