import React from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IAcademicPlan, IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/AdminDataModelAddForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';

const collection = AcademicPlans;

const descriptionPairs = (plan: IAcademicPlan): IDescriptionPair[] => [
  { label: 'Name', value: plan.name },
  { label: 'Year', value: `${plan.year}` },
  { label: 'Course Choices', value: `${plan.choiceList}` },
  { label: 'Retired', value: plan.retired ? 'True' : 'False' },
];

const itemTitleString = (plan: IAcademicPlan): string => {
  const slug = Slugs.getNameFromID(plan.slugID);
  return `${plan.name} (${plan.year}) (${slug})`;
};

const itemTitle = (plan: IAcademicPlan): React.ReactNode => (
  <React.Fragment>
    {plan.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(plan)}
  </React.Fragment>
);

/**
 * The AcademicPlan data model page.
 */
class AdminDataModelAcademicPlansPage extends React.Component<{}, IAdminDataModelPageState> {
  private readonly formRef;

  constructor(props) {
    super(props);
    this.state = { showUpdateForm: false, id: '', confirmOpen: false };
    this.formRef = React.createRef();
  }

  private handleAdd = (doc) => {
    console.log('AcademicPlans.handleAdd(%o)', doc);
    // const collectionName;
    // const definitionData;
  };

  private handleCancel = (event) => {
    event.preventDefault();
    this.setState({ showUpdateForm: false, id: '', confirmOpen: false });
  };

  private handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('AcademicPlans.handleDelete inst=%o state=%o', inst, this.state);
    this.setState({ confirmOpen: true, id: inst.id });
  };

  private handleConfirmDelete = () => {
    console.log('AcademicPlans.handleConfirmDelete state=%o', this.state);
    const collectionName = collection.getCollectionName();
    const instance = this.state.id;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error deleting AcademicPlan. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.setState({ id: '', confirmOpen: false });
    });
  };

  private handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    this.setState({ showUpdateForm: true, id: inst.id });
  };

  private handleUpdate = (doc) => {
    console.log(doc);
  };

  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    const findOptions = {
      sort: { year: 1, name: 1 },
    };
    const planName = this.state.id ? AcademicPlans.findDoc(this.state.id).name : '';
    return (
      <div className="layout-page">
        <AdminPageMenuWidget />
        <Grid container stackable style={paddedStyle}>

          <Grid.Column width={3}>
            <AdminDataModelMenu />
          </Grid.Column>

          <Grid.Column width={13}>
            {this.state.showUpdateForm ? (
              <AdminDataModelUpdateForm
                collection={AcademicPlans}
                id={this.state.id}
                formRef={this.formRef}
                handleUpdate={this.handleUpdate}
                handleCancel={this.handleCancel}
                itemTitleString={itemTitleString}
              />
            ) : (
              <AdminDataModelAddForm collection={AcademicPlans} formRef={this.formRef} handleAdd={this.handleAdd} />
            )}

            <ListCollectionWidget
              collection={AcademicPlans}
              findOptions={findOptions}
              descriptionPairs={descriptionPairs}
              itemTitle={itemTitle}
              handleOpenUpdate={this.handleOpenUpdate}
              handleDelete={this.handleDelete}
              setShowIndex={dataModelActions.setCollectionShowIndex}
              setShowCount={dataModelActions.setCollectionShowCount}
            />
          </Grid.Column>
        </Grid>
        <Confirm
          open={this.state.confirmOpen}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirmDelete}
          header="Delete Academic Plan?"
          content={`Delete ${planName}. Are you sure?`}
        />

        <BackToTopButton />
      </div>
    );
  }
}

export default AdminDataModelAcademicPlansPage;
