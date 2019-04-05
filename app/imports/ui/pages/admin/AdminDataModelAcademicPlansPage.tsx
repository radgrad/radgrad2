import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IAcademicPlan, IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import { setCollectionShowCount, setCollectionShowIndex } from '../../../redux/actions/paginationActions';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/AdminDataModelAddForm';

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

/**
 * The AcademicPlan data model page.
 */
class AdminDataModelAcademicPlansPage extends React.Component<{}, IAdminDataModelPageState> {
  private formRef;

  constructor(props) {
    super(props);
    this.handleOpenUpdate = this.handleOpenUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = { showUpdateForm: false, id: '' };
    this.formRef = React.createRef();
  }

  private handleOpenUpdate(evt, inst) {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  }

  private handleUpdate(doc) {
    // do stuff.
  }

  private handleAdd(doc) {
    // do stuff
  }

  private handleDelete(event, inst) {
    event.preventDefault();
    console.log('handleDelete inst=%o', inst);
  }

  private handleCancel(event) {
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
            {this.state.showUpdateForm ? (
              <AdminDataModelUpdateForm collection={AcademicPlans} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}/>
            ) : (
              <AdminDataModelAddForm collection={AcademicPlans} formRef={this.formRef} handleAdd={this.handleAdd}/>
            )}

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
