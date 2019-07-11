import * as React from 'react';
import { Confirm, Grid, Icon, Tab } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withTracker } from 'meteor/react-meteor-data';
import Swal from 'sweetalert2';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';
import {
  IAdminDataModelPageState, IAdvisorProfile, // eslint-disable-line
  IBaseProfile, ICombinedProfileDefine, IFacultyProfile, IMentorProfile, IStudentProfile, // eslint-disable-line
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
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import {
  academicPlanSlugFromName,
  careerGoalSlugFromName, declaredAcademicTermSlugFromName,
  interestSlugFromName,
} from '../../components/shared/FormHelperFunctions';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface IAdminDataModelUsersPageProps {
  advisors: IAdvisorProfile[];
  faculty: IFacultyProfile[];
  mentors: IMentorProfile[];
  students: IStudentProfile[];
}

const descriptionPairs = (user: IBaseProfile) => {
  const pairs = [];
  pairs.push({ label: 'Username', value: user.username });
  pairs.push({ label: 'Name', value: `${user.firstName}  ${user.lastName}` });
  pairs.push({ label: 'Role', value: user.role });
  pairs.push({ label: 'Picture', value: makeMarkdownLink(user.picture) });
  pairs.push({ label: 'Website', value: makeMarkdownLink(user.website) });
  pairs.push({ label: 'Career Goals', value: _.sortBy(CareerGoals.findNames(user.careerGoalIDs)) });
  pairs.push({ label: 'Interests', value: _.sortBy(Interests.findNames(user.interestIDs)) });
  if (user.role === ROLE.STUDENT) {
    pairs.push({ label: 'Level', value: `${user.level}` });
    // eslint-disable-next-line
    pairs.push({
      label: 'Degree',
      value: (user.academicPlanID) ? AcademicPlans.findDoc(user.academicPlanID).name : '',
    });
    // eslint-disable-next-line
    pairs.push({
      label: 'Declared Semester',
      value: (user.declaredAcademicTermID) ? AcademicTerms.toString(user.declaredAcademicTermID) : '',
    });
    pairs.push({ label: 'Opted In', value: user.optedIn ? 'True' : 'False' });
  }
  if (user.role === ROLE.MENTOR) {
    pairs.push({ label: 'Company', value: user.company });
    pairs.push({ label: 'Title', value: user.career });
    pairs.push({ label: 'Location', value: user.location });
    pairs.push({ label: 'LinkedIn', value: user.linkedin });
    pairs.push({ label: 'Motivation', value: user.motivation });
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
    {user.retired ? <Icon name="eye slash"/> : ''}
    <Icon name="dropdown"/>
    {itemTitleString(user)}
  </React.Fragment>
);

class AdminDataModelUsersPage extends React.Component<IAdminDataModelUsersPageProps, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '', confirmOpen: false };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc: ICombinedProfileDefine) => {
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
    if (doc.role === ROLE.MENTOR) {
      collectionName = MentorProfiles.getCollectionName();
    } else if (doc.role === ROLE.ADVISOR) {
      collectionName = AdvisorProfiles.getCollectionName();
    } else if (doc.role === ROLE.FACULTY) {
      collectionName = FacultyProfiles.getCollectionName();
    } else if (doc.role === ROLE.STUDENT) {
      if (_.isNil(doc.level)) {
        definitionData.level = 1;
      }
    }
    // console.log('collectionName=%o definitionData=%o', collectionName, definitionData);
    const inst = this;
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed adding User', error);
        Swal.fire({
          title: 'Failed adding User',
          text: error.message,
          type: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add User Succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        inst.formRef.current.reset();
      }
    });
  };

  private handleCancel = (event) => {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '', confirmOpen: false });
  };

  private handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    this.setState({ confirmOpen: true, id: inst.id });
  }

  private handleConfirmDelete = () => {
    // console.log('AcademicTerm.handleConfirmDelete state=%o', this.state);
    const profiles = Users.findProfiles({ _id: this.state.id }, {});
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
        case ROLE.MENTOR:
          collectionName = MentorProfiles.getCollectionName();
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
            type: 'error',
          });
        } else {
          Swal.fire({
            title: 'Delete User Succeeded',
            type: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        }
        this.setState({ showUpdateForm: false, id: '', confirmOpen: false });
      });
    }
  };

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    this.setState({ showUpdateForm: true, id: inst.id });
  };

  private handleUpdate = (doc) => {
    // console.log('handleUpdate(%o)', doc);
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    let collectionName;
    if (StudentProfiles.isDefined(updateData.id)) {
      collectionName = StudentProfiles.getCollectionName();
    }
    if (FacultyProfiles.isDefined(updateData.id)) {
      collectionName = FacultyProfiles.getCollectionName();
    }
    if (MentorProfiles.isDefined(updateData.id)) {
      collectionName = MentorProfiles.getCollectionName();
    }
    if (AdvisorProfiles.isDefined(updateData.id)) {
      collectionName = AdvisorProfiles.getCollectionName();
    }
    updateData.interests = _.map(doc.interests, (interest) => interestSlugFromName(interest));
    updateData.careerGoals = _.map(doc.careerGoals, (goal) => careerGoalSlugFromName(goal));
    if (!_.isNil(doc.academicPlan)) {
      updateData.academicPlan = academicPlanSlugFromName(doc.academicPlan);
    }
    if (!_.isNil(doc.declaredAcademicTerm)) {
      updateData.declaredAcademicTerm = declaredAcademicTermSlugFromName(doc.declaredAcademicTerm);
    }
    console.log(collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        this.setState({ showUpdateForm: false, id: '' });
      }
    });
  };

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const paddedStyle = {
      paddingTop: 20,
    };
    const panes = [
      {
        menuItem: `Advisors (${this.props.advisors.length})`, render: () => (
          <Tab.Pane><ListCollectionWidget collection={AdvisorProfiles}
                                          descriptionPairs={descriptionPairs}
                                          itemTitle={itemTitle}
                                          handleOpenUpdate={this.handleOpenUpdate}
                                          handleDelete={this.handleDelete}
                                          setShowIndex={setCollectionShowIndex}
                                          setShowCount={setCollectionShowCount}/></Tab.Pane>),
      },
      {
        menuItem: `Faculty (${this.props.faculty.length})`, render: () => (
          <Tab.Pane><ListCollectionWidget collection={FacultyProfiles}
                                          descriptionPairs={descriptionPairs}
                                          itemTitle={itemTitle}
                                          handleOpenUpdate={this.handleOpenUpdate}
                                          handleDelete={this.handleDelete}
                                          setShowIndex={setCollectionShowIndex}
                                          setShowCount={setCollectionShowCount}/></Tab.Pane>),
      },
      {
        menuItem: `Mentors (${this.props.mentors.length})`, render: () => (
          <Tab.Pane><ListCollectionWidget collection={MentorProfiles}
                                          descriptionPairs={descriptionPairs}
                                          itemTitle={itemTitle}
                                          handleOpenUpdate={this.handleOpenUpdate}
                                          handleDelete={this.handleDelete}
                                          setShowIndex={setCollectionShowIndex}
                                          setShowCount={setCollectionShowCount}/></Tab.Pane>),
      },
      {
        menuItem: `Students (${this.props.students.length})`, render: () => (
          <Tab.Pane><ListCollectionWidget collection={StudentProfiles}
                                          descriptionPairs={descriptionPairs}
                                          itemTitle={itemTitle}
                                          handleOpenUpdate={this.handleOpenUpdate}
                                          handleDelete={this.handleDelete}
                                          setShowIndex={setCollectionShowIndex}
                                          setShowCount={setCollectionShowCount}/></Tab.Pane>),
      },
    ];
    return (
      <div className="layout-page">
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={3}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={13}>
            {this.state.showUpdateForm ? (
              <UpdateUserForm id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}
                                        itemTitleString={itemTitleString}/>
            ) : (
              <AddUserForm formRef={this.formRef} handleAdd={this.handleAdd}/>
            )}
            <Tab panes={panes} defaultActiveIndex={3}/>
          </Grid.Column>
        </Grid>
        <Confirm open={this.state.confirmOpen} onCancel={this.handleCancel} onConfirm={this.handleConfirmDelete} header="Delete User?"/>

        <BackToTopButton/>
      </div>
    );
  }
}

export default withTracker(() => {
  const advisors = AdvisorProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const faculty = FacultyProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const mentors = MentorProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  const students = StudentProfiles.find({}, { sort: { lastName: 1, firstName: 1 } }).fetch();
  return {
    advisors,
    faculty,
    mentors,
    students,
  };
})(AdminDataModelUsersPage);
