import React, { useState } from 'react';
import { Confirm, Grid, Icon, Tab } from 'semantic-ui-react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';
import { AdminProfiles } from '../../../api/user/AdminProfileCollection';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import {
  IAdvisorProfile,
  IBaseProfile,
  ICombinedProfileDefine,
  IFacultyProfile,
  IFavoriteAcademicPlan,
  IFavoriteCareerGoal, IFavoriteInterest,
  IStudentProfile,
} from '../../../typings/radgrad';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { makeMarkdownLink } from './datamodel-utilities';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { ROLE } from '../../../api/role/Role';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import AddUserForm from '../../components/admin/AddUserForm';
import UpdateUserForm from '../../components/admin/UpdateUserForm';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import {
  academicPlanSlugFromName,
  careerGoalSlugFromName, declaredAcademicTermSlugFromName,
  interestSlugFromName,
} from '../../components/shared/FormHelperFunctions';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { RootState } from '../../../redux/types';

interface IAdminDataModelUsersPageProps {
  admins: IBaseProfile[];
  advisors: IAdvisorProfile[];
  faculty: IFacultyProfile[];
  students: IStudentProfile[];
  isCloudinaryUsed: boolean;
  cloudinaryUrl: string;
  // eslint-disable-next-line react/no-unused-prop-types
  favoriteAcademicPlans: IFavoriteAcademicPlan[];
  // eslint-disable-next-line react/no-unused-prop-types
  favoriteCareerGoals: IFavoriteCareerGoal[];
  // eslint-disable-next-line react/no-unused-prop-types
  favoriteInterests: IFavoriteInterest[];
}

const descriptionPairs = (props: IAdminDataModelUsersPageProps) => (user: IBaseProfile) => {
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
    const favoritePlans = _.filter(props.favoriteAcademicPlans, (fav) => fav.studentID === user.userID);
    // const favoritePlans = FavoriteAcademicPlans.findNonRetired({ studentID: user.userID });
    const planNames = _.map(favoritePlans, (f) => AcademicPlans.findDoc(f.academicPlanID).name);
    pairs.push({
      label: 'Degree',
      value: (planNames.length > 0) ? planNames.join(', ') : '',
    });
    pairs.push({
      label: 'Declared Semester',
      value: (user.declaredAcademicTermID) ? AcademicTerms.toString(user.declaredAcademicTermID) : '',
    });
    pairs.push({ label: 'Opted In', value: user.optedIn ? 'True' : 'False' });
  }
  pairs.push({ label: 'Retired', value: user.retired ? 'True' : 'False' });

  return pairs;
};

const itemTitleString = (user: IBaseProfile): string => {
  const alumni = user.isAlumni ? 'Alumni' : '';
  return `${user.firstName} ${user.lastName} (${user.username}) ${alumni}`;
};

const itemTitle = (user: IBaseProfile): React.ReactNode => (
  <React.Fragment>
    {user.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(user)}
  </React.Fragment>
);

const mapStateToProps = (state: RootState): object => ({
  isCloudinaryUsed: state.shared.cloudinary.adminDataModelUsers.isCloudinaryUsed,
  cloudinaryUrl: state.shared.cloudinary.adminDataModelUsers.cloudinaryUrl,
});

const AdminDataModelUsersPage = (props: IAdminDataModelUsersPageProps) => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc: ICombinedProfileDefine) => {
    // console.log('handleAdd(%o)', doc);
    const definitionData: ICombinedProfileDefine = doc;
    definitionData.interests = _.map(doc.interests, (interest) => interestSlugFromName(interest));
    definitionData.careerGoals = _.map(doc.careerGoals, (goal) => careerGoalSlugFromName(goal));
    if (!_.isNil(doc.academicPlan)) {
      definitionData.academicPlan = academicPlanSlugFromName(doc.academicPlan);
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
    // console.log(collectionName, updateData);
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

  const paddedStyle = {
    paddingTop: 20,
  };
  const panes = [
    {
      menuItem: `Admins (${props.admins.length})`, render: () => (
        <Tab.Pane>
          <ListCollectionWidget
            collection={AdminProfiles}
            descriptionPairs={descriptionPairs(props)}
            itemTitle={itemTitle}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
            setShowIndex={dataModelActions.setCollectionShowIndex}
            setShowCount={dataModelActions.setCollectionShowCount}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Advisors (${props.advisors.length})`, render: () => (
        <Tab.Pane>
          <ListCollectionWidget
            collection={AdvisorProfiles}
            descriptionPairs={descriptionPairs(props)}
            itemTitle={itemTitle}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
            setShowIndex={dataModelActions.setCollectionShowIndex}
            setShowCount={dataModelActions.setCollectionShowCount}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Faculty (${props.faculty.length})`, render: () => (
        <Tab.Pane>
          <ListCollectionWidget
            collection={FacultyProfiles}
            descriptionPairs={descriptionPairs(props)}
            itemTitle={itemTitle}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
            setShowIndex={dataModelActions.setCollectionShowIndex}
            setShowCount={dataModelActions.setCollectionShowCount}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: `Students (${props.students.length})`, render: () => (
        <Tab.Pane>
          <ListCollectionWidget
            collection={StudentProfiles}
            descriptionPairs={descriptionPairs(props)}
            itemTitle={itemTitle}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
            setShowIndex={dataModelActions.setCollectionShowIndex}
            setShowCount={dataModelActions.setCollectionShowCount}
          />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <div className="layout-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <UpdateUserForm
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
            />
          ) : (
            <AddUserForm formRef={formRef} handleAdd={handleAdd} />
          )}
          <Tab panes={panes} defaultActiveIndex={4} />
        </Grid.Column>
      </Grid>
      <Confirm
        open={confirmOpenState}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        header="Delete User?"
      />

      <BackToTopButton />
    </div>
  );
};

const AdminDataModelUsersPageCon = connect(mapStateToProps, null)(AdminDataModelUsersPage);
export default withTracker(() => {
  const admins = AdminProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const advisors = AdvisorProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const faculty = FacultyProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const favoriteAcademicPlans = FavoriteAcademicPlans.find().fetch();
  const favoriteCareerGoals = FavoriteCareerGoals.find().fetch();
  const favoriteInterests = FavoriteInterests.find().fetch();
  return {
    admins,
    advisors,
    faculty,
    students,
    favoriteAcademicPlans,
    favoriteCareerGoals,
    favoriteInterests,
  };
})(AdminDataModelUsersPageCon);
