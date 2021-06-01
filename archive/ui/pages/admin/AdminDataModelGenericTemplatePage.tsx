import React, { useState } from 'react';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import AdminPageMenu from '../../../../app/imports/ui/components/admin/AdminPageMenu';
import AdminDataModelMenu from '../../../../app/imports/ui/components/admin/datamodel/AdminDataModelMenu';
import ListCollectionWidget from '../../../../app/imports/ui/components/admin/datamodel/ListCollectionWidget';
import AdminDataModelUpdateForm from '../../../../app/imports/ui/components/admin/datamodel/AdminDataModelUpdateForm'; // this should be replaced by specific UpdateForm
import AdminDataModelAddForm from '../../../../app/imports/ui/components/admin/datamodel/AdminDataModelAddForm'; // this should be replaced by specific AddForm
import { DescriptionPair } from '../../../../app/imports/typings/radgrad';
import { defineMethod, removeItMethod, updateMethod } from '../../../../app/imports/api/base/BaseCollection.methods';
import BackToTopButton from '../../../../app/imports/ui/components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import RadGradAlert from "../../../../app/imports/ui/utilities/RadGradAlert";
const collection = null; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: any): DescriptionPair[] => [
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: any): string => `the ${item} title string`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: any): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

const AdminDataModelGenericTemplatePage = () => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('GenericTemplate.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc; // create the definitionData may need to modify doc's values
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        RadGradAlert.failure('Add failed', error.message, error);
      } else {
        RadGradAlert.success('Add succeeded');
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
    removeItMethod.call({ collectionName, instance })
      .catch((error) => { RadGradAlert.failure('Delete failed', error.message, error)})
      .then(() => { RadGradAlert.success('Delete succeeded')})
      .finally(() => {
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
    // console.log('GenericTemplate.handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc; // create the updateData object from the doc.
    updateData.id = doc._id;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        RadGradAlert.failure('Update failed', error.message, error);
        console.error('Error in updating. %o', error);
      } else {
        RadGradAlert.success('Update succeeded');
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
    <div>
      <AdminPageMenu />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <AdminDataModelUpdateForm
              collection={collection}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
            />
          ) : (
            <AdminDataModelAddForm collection={collection} formRef={formRef} handleAdd={handleAdd} />
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
        header="Delete Generic?"
      />

      <BackToTopButton />
    </div>
  );
};

export default AdminDataModelGenericTemplatePage;
