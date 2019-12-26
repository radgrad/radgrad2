import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { AutoForm, TextField, BoolField, LongTextField, NumField, SelectField, SubmitField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { Interests } from '../../../api/interest/InterestCollection';
import { IAcademicPlan, IAcademicTerm, IBaseProfile, ICareerGoal, IInterest } from '../../../typings/radgrad';
import BaseCollection from '../../../api/base/BaseCollection';
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
} from '../shared/data-model-helper-functions';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import MultiSelectField from '../shared/MultiSelectField';
import { openCloudinaryWidget } from '../shared/OpenCloudinaryWidget';
import { cloudinaryActions } from '../../../redux/shared/cloudinary';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';

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
  setAdminDataModelUsersIsCloudinaryUsed: (isCloudinaryUsed: boolean) => any;
  setAdminDataModelUsersCloudinaryUrl: (cloudinaryUrl: string) => any;
}

interface IUpdateUserState {
  pictureURL: string;
}

const mapDispatchToProps = (dispatch) => ({
  setAdminDataModelUsersIsCloudinaryUsed: (isCloudinaryUsed: boolean) => dispatch(cloudinaryActions.setAdminDataModelUsersIsCloudinaryUsed(isCloudinaryUsed)),
  setAdminDataModelUsersCloudinaryUrl: (cloudinaryUrl: string) => dispatch(cloudinaryActions.setAdminDataModelUsersCloudinaryUrl(cloudinaryUrl)),
});

class UpdateUserForm extends React.Component<IUpdateUserProps, IUpdateUserState> {
  constructor(props) {
    super(props);
    console.log('UpdateUserForm', props);
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
      this.props.setAdminDataModelUsersIsCloudinaryUsed(true);
      this.props.setAdminDataModelUsersCloudinaryUrl(cloudinaryResult.info.url);
      this.setState({ pictureURL: cloudinaryResult.info.url });
    }
  }

  private handlePictureUrlChange = (value) => {
    this.setState({ pictureURL: value });
  }

  // Hacky way of resetting pictureURL to be empty
  private handleUpdateUser = (doc) => {
    console.log('UpdateUserForm.handleUpdateUser', doc);
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
    const userID = model.userID;
    const favInterests = FavoriteInterests.findNonRetired({ userID });
    const favInterestIDs = _.map(favInterests, (fav) => fav.interestID);
    model.interests = _.map(favInterestIDs, interestIdToName);
    const favCareerGoals = FavoriteCareerGoals.findNonRetired({ userID });
    const favCareerGoalIDs = _.map(favCareerGoals, (fav) => fav.careerGoalID);
    model.careerGoals = _.map(favCareerGoalIDs, careerGoalIdToName);
    const favPlans = FavoriteAcademicPlans.findNonRetired({ studentID: userID });
    const favPlanIDs = _.map(favPlans, (fav) => fav.academicPlanID);
    model.academicPlans = _.map(favPlanIDs, (academicPlanID) => academicPlanIdToName(academicPlanID));
    if (model.declaredAcademicTermID) {
      model.declaredAcademicTerm = academicTermIdToName(model.declaredAcademicTermID);
    }
    const interestNames = _.map(this.props.interests, docToName);
    const careerGoalNames = _.map(this.props.careerGoals, docToName);
    const academicTermNames = _.map(this.props.academicTerms, academicTermToName);
    // const academicPlanNames = _.map(this.props.academicPlans, docToName);
    const schema = new SimpleSchema({
      username: { type: String, optional: true },
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      picture: {
        type: String,
        label:
  <React.Fragment>
Picture (
    {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
    <a onClick={this.handleUpload}>Upload</a>
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
      // academicPlans: {
      //   type: Array,
      //   optional: true,
      // },
      // 'academicPlans.$': {
      //   type: String,
      //   allowedValues: academicPlanNames,
      // },
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
    console.log(schema);
    return (
      <Segment padded>
        <Header dividing>
Update
          {collection.getType()}
:
          {this.props.itemTitleString(model)}
        </Header>
        <AutoForm
          schema={schema}
          onSubmit={this.props.handleUpdate}
          ref={this.props.formRef}
          showInlineError
          model={model}
        >
          <Form.Group widths="equal">
            <TextField name="username" placeholder="johndoe@foo.edu" />
            <TextField name="firstName" placeholder="John" />
            <TextField name="lastName" placeholder="Doe" />
          </Form.Group>
          <Header dividing as="h4">Optional fields (all users)</Header>
          <Form.Group widths="equal">
            <TextField name="picture" value={pictureURL} onChange={this.handlePictureUrlChange} />
            <TextField name="website" />
          </Form.Group>
          <Form.Group widths="equal">
            <MultiSelectField name="interests" />
            <MultiSelectField name="careerGoals" />
          </Form.Group>
          <BoolField name="retired" />
          {model.role === ROLE.MENTOR ? (
            <div>
              <Header dividing as="h4">Mentor fields</Header>
              <Form.Group widths="equal">
                <TextField name="company" />
                <TextField name="career" label="Title" />
              </Form.Group>
              <Form.Group widths="equal">
                <TextField name="location" />
                <TextField name="linkedin" label="LinkedIn" />
              </Form.Group>
              <LongTextField name="motivation" />
            </div>
          ) : ''}
          {model.role === ROLE.STUDENT || model.role === ROLE.ALUMNI ? (
            <div>
              <Header dividing as="h4">Student fields</Header>
              <Form.Group widths="equal">
                <NumField name="level" />
                <SelectField name="declaredAcademicTerm" />
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
          <SubmitField inputRef={undefined} value="Update" disabled={false} className="" />
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
