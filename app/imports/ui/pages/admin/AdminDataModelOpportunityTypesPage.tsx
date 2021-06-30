import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import RadGradAlert from '../../utilities/RadGradAlert';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { DescriptionPair, OpportunityType } from '../../../typings/radgrad';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import AddOpportunityTypeForm from '../../components/admin/datamodel/opportunity/AddOpportunityTypeForm';
import UpdateOpportunityTypeForm from '../../components/admin/datamodel/opportunity/UpdateOpportunityTypeForm';
import { itemToSlugName } from '../../components/shared/utilities/data-model';
import { PAGEIDS } from '../../utilities/PageIDs';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = OpportunityTypes; // the collection to use.

const numReferences = (opportunityType) => {
  let references = 0;
  Opportunities.find().forEach((doc) => {
    if (doc.opportunityTypeID.includes(opportunityType._id)) {
      // TODO: Why is this using .includes instead of ===?
      references += 1;
    }
  });
  return references;
};

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: OpportunityType): DescriptionPair[] => [
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
const itemTitleString = (item: OpportunityType): string => (OpportunityTypes.isDefined(item._id) ? `${item.name} (${itemToSlugName(item)})` : '');

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: OpportunityType): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelOpportunityTypesPageProps {
  items: OpportunityType[];
}

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelOpportunityTypesPage: React.FC<AdminDataModelOpportunityTypesPageProps> = ({ items }) => {
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
    <PageLayout id={PAGEIDS.DATA_MODEL_OPPORTUNITY_TYPES} headerPaneTitle="Opportunity Types">
      {showUpdateFormState ? <UpdateOpportunityTypeForm collection={collection} id={idState} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} /> : <AddOpportunityTypeForm />}
      <ListCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Opportunity Type?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  // We want to sort the items.
  const items = OpportunityTypes.find({}, { sort: { name: 1 } }).fetch();
  return {
    items,
  };
})(AdminDataModelOpportunityTypesPage);
