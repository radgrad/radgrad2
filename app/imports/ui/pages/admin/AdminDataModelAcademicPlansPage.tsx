import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IAcademicPlan, IDescriptionPair } from '../../../typings/radgrad';
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
const AdminDataModelAcademicPlansPage = () => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    console.log('AcademicPlans.handleAdd(%o)', doc);
    // const collectionName;
    // const definitionData;
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setConfirmOpen(false);
    setId('');
    setShowUpdateForm(false);
  };

  const handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('AcademicPlans.handleDelete inst=%o', inst);
    setConfirmOpen(true);
    setId(inst.id);
  };

  const handleConfirmDelete = () => {
    // console.log('AcademicPlans.handleConfirmDelete');
    const collectionName = collection.getCollectionName();
    const instance = idState;
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
      setId('');
      setConfirmOpen(false);
    });
  };

  const handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    setShowUpdateForm(true);
    setId(inst.id);
  };

  const handleUpdate = (doc) => {
    console.log(doc);
  };

  const paddedStyle = {
    paddingTop: 20,
  };
  const findOptions = {
    sort: { year: 1, name: 1 },
  };
  const planName = idState ? AcademicPlans.findDoc(idState).name : '';
  return (
    <div className="layout-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <AdminDataModelUpdateForm
              collection={AcademicPlans}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
            />
          ) : (
            <AdminDataModelAddForm collection={AcademicPlans} formRef={formRef} handleAdd={handleAdd} />
          )}

          <ListCollectionWidget
            collection={AcademicPlans}
            findOptions={findOptions}
            descriptionPairs={descriptionPairs}
            itemTitle={itemTitle}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
            setShowIndex={dataModelActions.setCollectionShowIndex}
            setShowCount={dataModelActions.setCollectionShowCount}
          />
        </Grid.Column>
      </Grid>
      <Confirm
        open={confirmOpenState}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
        header="Delete Academic Plan?"
        content={`Delete ${planName}. Are you sure?`}
      />

      <BackToTopButton />
    </div>
  );
};

export default AdminDataModelAcademicPlansPage;
