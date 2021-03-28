import React, { useState } from 'react';
import { Button, Confirm, Icon, Tab } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { AdminProfiles } from '../../../api/user/AdminProfileCollection';
import { ProfileCourses } from '../../../api/user/profile-entries/ProfileCourseCollection';
import { ProfileOpportunities } from '../../../api/user/profile-entries/ProfileOpportunityCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import {
  AcademicTerm,
  BaseProfile,
  CareerGoal,
  CombinedProfileDefine,
  AdvisorOrFacultyProfile,
  ProfileCareerGoal,
  ProfileInterest,
  Interest,
  StudentProfile,
  ProfileCourse, ProfileOpportunity, Course, Opportunity,
} from '../../../typings/radgrad';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { defineCallback } from '../../components/admin/datamodel/utilities/add-form';
import { courseNameToSlug, opportunityNameToSlug } from '../../components/shared/utilities/data-model';
import {
  handleCancelWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
  updateCallBack,
} from './utilities/data-model-page-callbacks';
import { makeMarkdownLink } from './utilities/datamodel';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { ROLE } from '../../../api/role/Role';
import AddUserForm from '../../components/admin/datamodel/user/AddUserForm';
import UpdateUserForm from '../../components/admin/datamodel/user/UpdateUserForm';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { careerGoalSlugFromName, declaredAcademicTermSlugFromName, interestSlugFromName } from '../../components/shared/utilities/form';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import { ProfileCareerGoals } from '../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileInterests } from '../../../api/user/profile-entries/ProfileInterestCollection';
import { RootState } from '../../../redux/types';
import PageLayout from '../PageLayout';
import { careerGoalInterestConversionMethod } from '../../../api/utilities/InterestConversion.methods';

interface AdminDataModelUsersPageProps {
  admins: BaseProfile[];
  advisors: AdvisorOrFacultyProfile[];
  faculty: AdvisorOrFacultyProfile[];
  students: StudentProfile[];
  isCloudinaryUsed: boolean;
  cloudinaryUrl: string;
  profileCareerGoals: ProfileCareerGoal[];
  profileCourses: ProfileCourse[];
  profileInterests: ProfileInterest[];
  profileOpportunities: ProfileOpportunity[];
  interests: Interest[];
  careerGoals: CareerGoal[];
  academicTerms: AcademicTerm[];
  courses: Course[];
  opportunities: Opportunity[];
}

const descriptionPairs = (props: AdminDataModelUsersPageProps) => (user: BaseProfile) => {
  const pairs = [];
  pairs.push({ label: 'Username', value: user.username });
  pairs.push({ label: 'Name', value: `${user.firstName}  ${user.lastName}` });
  pairs.push({ label: 'Role', value: user.role });
  pairs.push({ label: 'Picture', value: makeMarkdownLink(user.picture) });
  pairs.push({ label: 'Website', value: makeMarkdownLink(user.website) });
  const profileCareerGoals = props.profileCareerGoals.filter((fav) => fav.userID === user.userID);
  // const profileCareerGoals = ProfileCareerGoals.findNonRetired({ studentID: user.userID });
  const careerGoalIDs = profileCareerGoals.map((f) => f.careerGoalID);
  pairs.push({ label: 'Career Goals', value: _.sortBy(CareerGoals.findNames(careerGoalIDs)) });
  const profileInterests = props.profileInterests.filter((fav) => fav.userID === user.userID);
  // const profileInterests = ProfileInterests.findNonRetired({ studentID: user.userID });
  const interestIDs = profileInterests.map((f) => f.interestID);
  pairs.push({ label: 'Interests', value: _.sortBy(Interests.findNames(interestIDs)) });
  if (user.role === ROLE.STUDENT) {
    const profileCourses = props.profileCourses.filter((fav) => fav.studentID === user.userID);
    const courseIDs = profileCourses.map((fav) => fav.courseID);
    pairs.push({ label: 'Courses', value: _.sortBy(Courses.findNames(courseIDs)) });
    const profileOpportunities = props.profileOpportunities.filter((fav) => fav.studentID === user.userID);
    const opportunityIDs = profileOpportunities.map((fav) => fav.opportunityID);
    pairs.push({ label: 'Opportunities', value: _.sortBy(Opportunities.findNames(opportunityIDs)) });
    pairs.push({ label: 'Level', value: `${user.level}` });
    pairs.push({
      label: 'Declared Semester',
      value: user.declaredAcademicTermID ? AcademicTerms.toString(user.declaredAcademicTermID) : '',
    });
    pairs.push({ label: 'Opted In', value: user.optedIn ? 'True' : 'False' });
    if (user.lastRegistrarLoad) {
      pairs.push({ label: 'Last Registrar Load', value: `${moment(user.lastRegistrarLoad).format()}` });
    }
    if (user.lastVisitedCareerGoals) {
      pairs.push({ label: 'Last visited career goals', value: `${moment(user.lastVisitedCareerGoals).format()}`});
    }
    if (user.lastVisitedCourses) {
      pairs.push({ label: 'Last visited courses', value: `${moment(user.lastVisitedCourses).format()}`});
    }
    if (user.lastVisitedInterests) {
      pairs.push({ label: 'Last visited interests', value: `${moment(user.lastVisitedInterests).format()}`});
    }
    if (user.lastVisitedOpportunities) {
      pairs.push({ label: 'Last visited opportunities', value: `${moment(user.lastVisitedOpportunities).format()}`});
    }
  }
  if (user.role === ROLE.FACULTY) {
    pairs.push({ label: 'About Me', value: `${user.aboutMe}` });
  }
  if (user.role === ROLE.ADVISOR) {
    pairs.push({ label: 'About Me', value: `${user.aboutMe}` });
  }
  pairs.push({ label: 'Retired', value: user.retired ? 'True' : 'False' });

  return pairs;
};

const itemTitleString = (user: BaseProfile): string => {
  const alumni = user.isAlumni ? 'Alumni' : '';
  return `${user.firstName} ${user.lastName} (${user.username}) ${alumni}`;
};

const itemTitle = (user: BaseProfile): React.ReactNode => (
  <React.Fragment>
    {user.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(user)}
  </React.Fragment>
);

const mapStateToProps = (state: RootState): unknown => ({
  isCloudinaryUsed: state.shared.cloudinary.adminDataModelUsers.isCloudinaryUsed,
  cloudinaryUrl: state.shared.cloudinary.adminDataModelUsers.cloudinaryUrl,
});

const AdminDataModelUsersPage: React.FC<AdminDataModelUsersPageProps> = (props) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc: CombinedProfileDefine) => {
    // console.log('handleAdd(%o)', doc);
    const definitionData: CombinedProfileDefine = doc;
    definitionData.interests = doc.interests.map((interest) => interestSlugFromName(interest));
    definitionData.careerGoals = doc.careerGoals.map((goal) => careerGoalSlugFromName(goal));
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
    const { isCloudinaryUsed, cloudinaryUrl } = props;
    if (isCloudinaryUsed) {
      definitionData.picture = cloudinaryUrl;
    }
    // console.log(collectionName, definitionData);
    defineMethod.call({ collectionName, definitionData }, defineCallback(formRef));
  };

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleConfirmDelete = () => {
    const profiles = Users.findProfiles({ _id: idState }, {});
    if (profiles.length > 0) {
      const profile = profiles[0];
      let collectionName;
      switch (profile.role) {
        case ROLE.ADVISOR:
          collectionName = AdvisorProfiles.getCollectionName();
          break;
        case ROLE.FACULTY:
          collectionName = FacultyProfiles.getCollectionName();
          break;
        default:
          collectionName = StudentProfiles.getCollectionName();
      }
      const instance = profile._id;
      // console.log('removeIt.call(%o, %o)', collectionName, instance);
      removeItMethod.call({ collectionName, instance }, (error) => {
        if (error) {
          Swal.fire({
            title: 'Failed deleting User',
            text: error.message,
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'Delete User Succeeded',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        }
        setShowUpdateForm(false);
        setId('');
        setConfirmOpen(false);
      });
    }
  };

  const handleUpdate = (doc) => {
    // console.log('UsersPage.handleUpdate(%o)', doc);
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    let collectionName;
    if (StudentProfiles.isDefined(updateData.id)) {
      collectionName = StudentProfiles.getCollectionName();
    }
    if (FacultyProfiles.isDefined(updateData.id)) {
      collectionName = FacultyProfiles.getCollectionName();
    }
    if (AdvisorProfiles.isDefined(updateData.id)) {
      collectionName = AdvisorProfiles.getCollectionName();
    }
    if (AdminProfiles.isDefined(updateData.id)) {
      collectionName = AdminProfiles.getCollectionName();
    }
    updateData.interests = doc.interests.map((interest) => interestSlugFromName(interest));
    updateData.careerGoals = doc.careerGoals.map((goal) => careerGoalSlugFromName(goal));
    updateData.profileCourses = doc.courses.map((course) => courseNameToSlug(course));
    updateData.profileOpportunities = doc.opportunities.map((opp) => opportunityNameToSlug(opp));
    if (!_.isNil(doc.declaredAcademicTerm)) {
      updateData.declaredAcademicTerm = declaredAcademicTermSlugFromName(doc.declaredAcademicTerm);
    }
    const { isCloudinaryUsed, cloudinaryUrl } = props;
    if (isCloudinaryUsed) {
      updateData.picture = cloudinaryUrl;
    }
    // console.log(updateData);
    updateMethod.call({ collectionName, updateData }, updateCallBack(setShowUpdateForm, setId));
  };

  const handleConvert = () => {
    careerGoalInterestConversionMethod.call({});
  };

  const panes = [
    {
      menuItem: `Admins (${props.admins.length})`,
      render: () => (
        <Tab.Pane>
          <ListCollectionWidget
            collection={AdminProfiles}
            descriptionPairs={descriptionPairs(props)}
            itemTitle={itemTitle}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
            setShowIndex={dataModelActions.setCollectionShowIndex}
            setShowCount={dataModelActions.setCollectionShowCount}
            items={props.admins}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Advisors (${props.advisors.length})`,
      render: () => (
        <Tab.Pane>
          <ListCollectionWidget
            collection={AdvisorProfiles}
            descriptionPairs={descriptionPairs(props)}
            itemTitle={itemTitle}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
            setShowIndex={dataModelActions.setCollectionShowIndex}
            setShowCount={dataModelActions.setCollectionShowCount}
            items={props.advisors}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Faculty (${props.faculty.length})`,
      render: () => (
        <Tab.Pane>
          <ListCollectionWidget
            collection={FacultyProfiles}
            descriptionPairs={descriptionPairs(props)}
            itemTitle={itemTitle}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
            setShowIndex={dataModelActions.setCollectionShowIndex}
            setShowCount={dataModelActions.setCollectionShowCount}
            items={props.faculty}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Students (${props.students.length})`,
      render: () => (
        <Tab.Pane>
          <ListCollectionWidget
            collection={StudentProfiles}
            descriptionPairs={descriptionPairs(props)}
            itemTitle={itemTitle}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
            setShowIndex={dataModelActions.setCollectionShowIndex}
            setShowCount={dataModelActions.setCollectionShowCount}
            items={props.students}
          />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <PageLayout id="data-model-users-page" headerPaneTitle="Users">
      {showUpdateFormState ? (
        <UpdateUserForm
          id={idState}
          formRef={formRef}
          handleUpdate={handleUpdate}
          handleCancel={handleCancel}
          itemTitleString={itemTitleString}
          interests={props.interests}
          careerGoals={props.careerGoals}
          academicTerms={props.academicTerms}
          courses={props.courses}
          opportunities={props.opportunities}
        />
      ) : (
        <AddUserForm formRef={formRef} handleAdd={handleAdd} interests={props.interests} careerGoals={props.careerGoals}
                     academicTerms={props.academicTerms}/>
      )}
      <Tab panes={panes} defaultActiveIndex={3}/>
      <Button color="green" basic onClick={handleConvert}>Convert Career Goal Interests</Button>
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete User?"/>
    </PageLayout>
  );
};

const AdminDataModelUsersPageCon = connect(mapStateToProps, null)(AdminDataModelUsersPage);
export default withTracker(() => {
  const admins = AdminProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const advisors = AdvisorProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const faculty = FacultyProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const profileCareerGoals = ProfileCareerGoals.find().fetch();
  const profileInterests = ProfileInterests.find().fetch();
  const profileCourses = ProfileCourses.find().fetch();
  const profileOpportunities = ProfileOpportunities.find().fetch();
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  let academicTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  academicTerms = academicTerms.filter((term) => term.termNumber <= currentTerm.termNumber && term.termNumber > currentTerm.termNumber - 8);
  const courses = Courses.find().fetch();
  const opportunities = Opportunities.find().fetch();
  return {
    interests,
    careerGoals,
    courses,
    academicTerms,
    opportunities,
    admins,
    advisors,
    faculty,
    students,
    profileCareerGoals,
    profileCourses,
    profileInterests,
    profileOpportunities,
  };
})(AdminDataModelUsersPageCon);
