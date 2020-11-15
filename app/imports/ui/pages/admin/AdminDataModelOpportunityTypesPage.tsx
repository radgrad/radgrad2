import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import { IDescriptionPair, IOpportunityType } from '../../../typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import AddOpportunityTypeForm from '../../components/admin/datamodel/opportunity/AddOpportunityTypeForm';
import UpdateOpportunityTypeForm from '../../components/admin/datamodel/opportunity/UpdateOpportunityTypeForm';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { itemToSlugName } from '../../components/shared/utilities/data-model';

const collection = OpportunityTypes; // the collection to use.

function numReferences(opportunityType) {
  let references = 0;
  Opportunities.find().forEach(function (doc) {
    if (_.includes(doc.opportunityTypeID, opportunityType._id)) {
      references += 1;
    }
  });
  return references;
}

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: IOpportunityType): IDescriptionPair[] => [
  { label: 'Name', value: item.name },
  { label: 'Slug', value: `${Slugs.findDoc(item.slugID).name}` },
  { label: 'Description', value: item.description },
  { label: 'References', value: `${numReferences(item)}` },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: IOpportunityType): string => `${item.name} (${itemToSlugName(item)})`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: IOpportunityType): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

const AdminDataModelOpportunityTypesPage = () => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('OpportunityTypes.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc;
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Add failed',
          text: error.message,
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Add succeeded',
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
    const collectionName = collection.getCollectionName();
    const instance = idState;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error deleting. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setShowUpdateForm(false);
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
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc;
    updateData.id = doc._id;
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
  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <div id="data-model-opportunity-types-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <UpdateOpportunityTypeForm
              collection={collection}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
            />
          ) : (
            <AddOpportunityTypeForm formRef={formRef} handleAdd={handleAdd} />
          )}
          <ListCollectionWidget
            collection={collection}
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
        header="Delete Opportunity Type?"
      />

      <BackToTopButton />
    </div>
  );
};

export default AdminDataModelOpportunityTypesPage;
