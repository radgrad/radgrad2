import React, { useState } from 'react';
import { Button, Confirm, Icon, Tab } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';
import { AdminProfiles } from '../../../api/user/AdminProfileCollection';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import { AcademicTerm, BaseProfile, CareerGoal, CombinedProfileDefine, AdvisorOrFacultyProfile, FavoriteCareerGoal, FavoriteInterest, Interest, StudentProfile } from '../../../typings/radgrad';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { getDatamodelCount, makeMarkdownLink } from './utilities/datamodel';
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
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
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
  favoriteCareerGoals: FavoriteCareerGoal[];
  favoriteInterests: FavoriteInterest[];
  interests: Interest[];
  careerGoals: CareerGoal[];
  academicTerms: AcademicTerm[];
}

const descriptionPairs = (props: AdminDataModelUsersPageProps) => (user: BaseProfile) => {
  const pairs = [];
  pairs.push({ label: 'Username', value: user.username });
  pairs.push({ label: 'Name', value: `${user.firstName}  ${user.lastName}` });
  pairs.push({ label: 'Role', value: user.role });
  pairs.push({ label: 'Picture', value: makeMarkdownLink(user.picture) });
  pairs.push({ label: 'Website', value: makeMarkdownLink(user.website) });
  const favoriteCareerGoals = _.filter(props.favoriteCareerGoals, (fav) => fav.userID === user.userID);
  // const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ studentID: user.userID });
  const careerGoalIDs = _.map(favoriteCareerGoals, (f) => f.careerGoalID);
  pairs.push({ label: 'Career Goals', value: _.sortBy(CareerGoals.findNames(careerGoalIDs)) });
  const favoriteInterests = _.filter(props.favoriteInterests, (fav) => fav.userID === user.userID);
  // const favoriteInterests = FavoriteInterests.findNonRetired({ studentID: user.userID });
  const interestIDs = _.map(favoriteInterests, (f) => f.interestID);
  pairs.push({ label: 'Interests', value: _.sortBy(Interests.findNames(interestIDs)) });
  if (user.role === ROLE.STUDENT) {
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

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelUsersPage: React.FC<AdminDataModelUsersPageProps> = (props) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc: CombinedProfileDefine) => {
    // console.log('handleAdd(%o)', doc);
    const definitionData: CombinedProfileDefine = doc;
    definitionData.interests = _.map(doc.interests, (interest) => interestSlugFromName(interest));
    definitionData.careerGoals = _.map(doc.careerGoals, (goal) => careerGoalSlugFromName(goal));
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
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed adding User', error);
        Swal.fire({
          title: 'Failed adding User',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add User Succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        // @ts-ignore
        formRef.current.reset();
      }
    });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setShowUpdateForm(false);
    setId('');
    setConfirmOpen(false);
  };

  const handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    setConfirmOpen(true);
    setId(inst.id);
  };

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

  const handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    setShowUpdateForm(true);
    setId(inst.id);
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
    updateData.interests = _.map(doc.interests, (interest) => interestSlugFromName(interest));
    updateData.careerGoals = _.map(doc.careerGoals, (goal) => careerGoalSlugFromName(goal));
    if (!_.isNil(doc.declaredAcademicTerm)) {
      updateData.declaredAcademicTerm = declaredAcademicTermSlugFromName(doc.declaredAcademicTerm);
    }
    const { isCloudinaryUsed, cloudinaryUrl } = props;
    if (isCloudinaryUsed) {
      updateData.picture = cloudinaryUrl;
    }
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        setShowUpdateForm(false);
        setId('');
      }
    });
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
        />
      ) : (
        <AddUserForm formRef={formRef} handleAdd={handleAdd} interests={props.interests} careerGoals={props.careerGoals}
                     academicTerms={props.academicTerms}/>
      )}
      <Tab panes={panes} defaultActiveIndex={3}/>
      <Button onClick={handleConvert}>Convert Career Goal Interests</Button>
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
  const favoriteCareerGoals = FavoriteCareerGoals.find().fetch();
  const favoriteInterests = FavoriteInterests.find().fetch();
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  let academicTerms = AcademicTerms.find({}, { sort: { termNumber: 1 } }).fetch();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  academicTerms = _.filter(academicTerms, (term) => term.termNumber <= currentTerm.termNumber && term.termNumber > currentTerm.termNumber - 8);
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    interests,
    careerGoals,
    academicTerms,
    admins,
    advisors,
    faculty,
    students,
    favoriteCareerGoals,
    favoriteInterests,
  };
})(AdminDataModelUsersPageCon);
