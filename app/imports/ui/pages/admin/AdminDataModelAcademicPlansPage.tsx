import * as React from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IAcademicPlan, IAdminDataModelPageState, IDescriptionPair } from '../../../typings/radgrad'; // eslint-disable-line
import { Slugs } from '../../../api/slug/SlugCollection';
import AdminDataModelUpdateForm from '../../components/admin/AdminDataModelUpdateForm';
import AdminDataModelAddForm from '../../components/admin/AdminDataModelAddForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';

const descriptionPairs = (plan: IAcademicPlan): IDescriptionPair[] => [
  { label: 'Name', value: plan.name },
  { label: 'Year', value: `${plan.year}` },
  { label: 'Course Choices', value: `${plan.courseList}` },
  { label: 'Retired', value: plan.retired ? 'True' : 'False' },
];

const itemTitleString = (plan: IAcademicPlan): string => {
  const slug = Slugs.getNameFromID(plan.slugID);
  return `${plan.name} (${plan.year}) (${slug})`;
};

const itemTitle = (plan: IAcademicPlan): React.ReactNode => (
  <React.Fragment>
    {plan.retired ? <Icon name="eye slash"/> : ''}
    <Icon name="dropdown"/>
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
    console.log('handleDelete inst=%o state=%o', inst, this.state);
    this.setState({ confirmOpen: true, id: inst.id });
  };

  private handleConfirmDelete = (event) => {
    event.preventDefault();
    console.log('handle confirm delete state=%o', this.state);
    this.setState({ confirmOpen: false });
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
    return (
      <div className="layout-page">
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={3}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={13}>
            {this.state.showUpdateForm ? (
              <AdminDataModelUpdateForm collection={AcademicPlans} id={this.state.id} formRef={this.formRef}
                                        handleUpdate={this.handleUpdate} handleCancel={this.handleCancel}
                                        itemTitleString={itemTitleString}/>
            ) : (
              <AdminDataModelAddForm collection={AcademicPlans} formRef={this.formRef} handleAdd={this.handleAdd}/>
            )}

            <ListCollectionWidget collection={AcademicPlans}
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
        <Confirm open={this.state.confirmOpen} onCancel={this.handleCancel} onConfirm={this.handleConfirmDelete} header="Delete Academic Plan?"/>

        <BackToTopButton/>
      </div>
    );
  }
}

export default AdminDataModelAcademicPlansPage;
