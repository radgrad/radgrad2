import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IAcademicPlan, IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';

const descriptionPairs = (plan: IAcademicPlan): IDescriptionPair[] => {
  return [
    { label: 'Name', value: plan.name },
    { label: 'Year', value: `${plan.year}` },
    { label: 'Course Choices', value: `${plan.courseList}` },
    { label: 'Retired', value: plan.retired ? 'True' : 'False' },
  ];
};

const itemTitle = (plan: IAcademicPlan): React.ReactNode => {
  const slug = Slugs.getNameFromID(plan.slugID);
  return (
    <React.Fragment>
      {plan.retired ? <Icon name="eye slash"/> : ''}
      <Icon name="dropdown"/>
      {`${plan.name} (${plan.year}) (${slug})`}
    </React.Fragment>
  );
};

const deleteDisabled = (plan: IAcademicPlan) => {
  const studentPlans = StudentProfiles.find({}, { fields: { academicPlanID: 1 } }).fetch();
  // console.log(studentPlans, plan._id, _.some(studentPlans, { academicPlanID: plan._id }));
  return _.some(studentPlans, { academicPlanID: plan._id });
};

const updateDisabled = (plan: IAcademicPlan) => false;

/**
 * The AcademicPlan data model page.
 */
class AdminDataModelAcademicPlansPage extends React.Component<{}, IAdminDataModelPageState> {
  constructor(props) {
    super(props);
    this.handleOpenUpdate = this.handleOpenUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = { showUpdateForm: false, id: '' };
  }

  private handleOpenUpdate(evt, inst) {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate(doc) {
    // do stuff.
  }

  private handleDelete(event, inst) {
    event.preventDefault();
    console.log('handleDelete inst=%o', inst);
  }

  private handleCancel(event, instance) {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '' });
  }

  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={4}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={12}>
            <ListCollectionWidget collection={AcademicPlans}
                                  descriptionPairs={descriptionPairs}
                                  itemTitle={itemTitle}
                                  handleOpenUpdate={this.handleOpenUpdate}
                                  handleDelete={this.handleDelete}
                                  setShowIndex={setCollectionShowIndex}
                                  setShowCount={setCollectionShowCount}
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AdminDataModelAcademicPlansPage;
