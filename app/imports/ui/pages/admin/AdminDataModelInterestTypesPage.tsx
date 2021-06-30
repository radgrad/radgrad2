import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import RadGradAlert from '../../utilities/RadGradAlert';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { DescriptionPair, InterestType } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import AddInterestTypeForm from '../../components/admin/datamodel/interest/AddInterestTypeForm';
import UpdateInterestTypeForm from '../../components/admin/datamodel/interest/UpdateInterestTypeForm';
import { itemToSlugName } from '../../components/shared/utilities/data-model';
import { PAGEIDS } from '../../utilities/PageIDs';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = InterestTypes; // the collection to use.

const numReferences = (interestType) => {
  let references = 0;
  Interests.find().forEach((doc) => {
    if (doc.interestTypeID.includes(interestType._id)) {
      references += 1;
    }
  });
  return references;
};

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: InterestType): DescriptionPair[] => [
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
const itemTitleString = (item: InterestType): string => (InterestTypes.isDefined(item._id) ? `${item.name} (${itemToSlugName(item)})` : '');

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: InterestType): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelInterestTypesPageProps {
  items: InterestType[];
}

const AdminDataModelInterestTypesPage: React.FC<AdminDataModelInterestTypesPageProps> = ({ items }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc;
    updateData.id = doc._id;
    updateMethod
      .callPromise({ collectionName, updateData })
      .catch((error) => {
        RadGradAlert.failure('Update Failed', error.message, error);
      })
      .then(() => {
        RadGradAlert.success('Update Succeeded');
        setShowUpdateForm(false);
        setId('');
      });
  };

  return (
    <PageLayout id={PAGEIDS.DATA_MODEL_INTEREST_TYPES} headerPaneTitle="Interest Types">
      {showUpdateFormState ? <UpdateInterestTypeForm collection={collection} id={idState} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} /> : <AddInterestTypeForm />}
      <ListCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Interest Type?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  // We want to sort the items.
  const items = InterestTypes.find({}, { sort: { name: 1 } }).fetch();
  return {
    items,
  };
})(AdminDataModelInterestTypesPage);
