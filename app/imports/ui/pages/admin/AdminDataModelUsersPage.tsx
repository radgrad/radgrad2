import * as React from 'react';
import { Grid, Icon, Tab } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';
import {
  IAdminDataModelPageState,
  IBaseProfile, ICombinedProfileDefine,
} from '../../../typings/radgrad';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { makeMarkdownLink } from './datamodel-utilities';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { ROLE } from '../../../api/role/Role';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AddUserForm from '../../components/admin/AddUserForm';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import {
  academicPlanSlugFromName,
  careerGoalSlugFromName,
  interestSlugFromName
} from '../../components/shared/FormHelperFunctions';

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
    // pairs.push({ label: 'Share Email', value: user.shareUsername ? 'True' : 'False' });
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

const itemTitle = (user: IBaseProfile): React.ReactNode => {
  return (
    <React.Fragment>
      {user.retired ? <Icon name="eye slash"/> : ''}
      <Icon name="dropdown"/>
      {itemTitleString(user)}
    </React.Fragment>
  );
};

class AdminDataModelUsersPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '' };
    this.formRef = React.createRef();
  }

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate = (doc) => {
    console.log('handleUpdate(%o)', doc);
  }

  private handleAdd = (doc: ICombinedProfileDefine) => {
    console.log('handleAdd(%o)', doc);
    const definitionData: ICombinedProfileDefine = doc;
    definitionData.interests = _.map(doc.interests, (interest) => interestSlugFromName(interest));
    definitionData.careerGoals = _.map(doc.careerGoals, (goal) => careerGoalSlugFromName(goal));
    if (!_.isNil(doc.academicPlan)) {
      definitionData.academicPlan = academicPlanSlugFromName(doc.academicPlan);
    }
    console.log('definitionData=%o', definitionData);
  }

  private handleDelete = (event, inst) => {
    event.preventDefault();
    console.log('handleDelete inst=%o', inst);
  }

  private handleCancel = (event) => {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '' });
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const paddedStyle = {
      paddingTop: 20,
    };
    const panes = [
      {
        menuItem: `Advisors (${AdvisorProfiles.count()})`, render: () => (
          <Tab.Pane><ListCollectionWidget collection={AdvisorProfiles}
                                          descriptionPairs={descriptionPairs}
                                          itemTitle={itemTitle}
                                          handleOpenUpdate={this.handleOpenUpdate}
                                          handleDelete={this.handleDelete}
                                          setShowIndex={setCollectionShowIndex}
                                          setShowCount={setCollectionShowCount}/></Tab.Pane>),
      },
      {
        menuItem: `Faculty (${FacultyProfiles.count()})`, render: () => (
          <Tab.Pane><ListCollectionWidget collection={FacultyProfiles}
                                          descriptionPairs={descriptionPairs}
                                          itemTitle={itemTitle}
                                          handleOpenUpdate={this.handleOpenUpdate}
                                          handleDelete={this.handleDelete}
                                          setShowIndex={setCollectionShowIndex}
                                          setShowCount={setCollectionShowCount}/></Tab.Pane>),
      },
      {
        menuItem: `Mentors (${MentorProfiles.count()})`, render: () => (
          <Tab.Pane><ListCollectionWidget collection={MentorProfiles}
                                          descriptionPairs={descriptionPairs}
                                          itemTitle={itemTitle}
                                          handleOpenUpdate={this.handleOpenUpdate}
                                          handleDelete={this.handleDelete}
                                          setShowIndex={setCollectionShowIndex}
                                          setShowCount={setCollectionShowCount}/></Tab.Pane>),
      },
      {
        menuItem: `Students (${StudentProfiles.count()})`, render: () => (
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
              <AdminDataModelUpdateForm collection={StudentProfiles} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}
                                        itemTitleString={itemTitleString}/>
            ) : (
              <AddUserForm formRef={this.formRef} handleAdd={this.handleAdd}/>
            )}
            <Tab panes={panes} defaultActiveIndex={3}/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AdminDataModelUsersPage;
