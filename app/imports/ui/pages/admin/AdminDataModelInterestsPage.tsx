import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import { InterestKeywords } from '../../../api/interest/InterestKeywordCollection';
import RadGradAlert from '../../utilities/RadGradAlert';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { DescriptionPair, Interest, InterestType, InterestUpdate } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import AddInterestForm from '../../components/admin/datamodel/interest/AddInterestForm';
import UpdateInterestForm from '../../components/admin/datamodel/interest/UpdateInterestForm';
import { itemToSlugName, interestTypeNameToId } from '../../components/shared/utilities/data-model';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';

const collection = Interests; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: Interest): DescriptionPair[] => {
  const keywords = Interests.isDefined(item._id) && InterestKeywords.getKeywords(item._id);
  return [
    { label: 'Description', value: item.description },
    { label: 'Interest Type', value: InterestTypes.findDoc(item.interestTypeID).name },
    { label: 'Retired', value: item.retired ? 'True' : 'False' },
    { label: 'Keywords', value: keywords && keywords.length > 0 ? keywords.join(', ') : 'None' },
  ];
};

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: Interest): string => (Interests.isDefined(item._id) ? `${item.name} (${itemToSlugName(item)})` : '');

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: Interest): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelInterestsPageProps {
  items: Interest[];
  interestTypes: InterestType[];
}

const AdminDataModelInterestsPage: React.FC<AdminDataModelInterestsPageProps> = ({ items, interestTypes }) => {
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
    const updateData: InterestUpdate = doc;
    updateData.id = doc._id;
    updateData.picture = doc.picture;
    if (doc.interestType) {
      updateData.interestType = interestTypeNameToId(doc.interestType);
    }
    // console.log(updateData);
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
    <PageLayout id={PAGEIDS.DATA_MODEL_INTERESTS} headerPaneTitle="Interests">
      {showUpdateFormState ? (
        <UpdateInterestForm collection={collection} id={idState} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} interestTypes={interestTypes} />
      ) : (
        <AddInterestForm interestTypes={interestTypes} />
      )}
      <ListCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Interest?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  // We want to sort the items.
  const items = Interests.find({}, { sort: { name: 1 } }).fetch();
  const interestTypes = InterestTypes.find({}, { sort: { name: 1 } }).fetch();
  return {
    items,
    interestTypes,
  };
})(AdminDataModelInterestsPage);
