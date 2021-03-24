import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { dataModelActions } from '../../../redux/admin/data-model';
import { DescriptionPair, Interest, InterestType, InterestUpdate } from '../../../typings/radgrad';
import { removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import AddInterestForm from '../../components/admin/datamodel/interest/AddInterestForm';
import UpdateInterestForm from '../../components/admin/datamodel/interest/UpdateInterestForm';
import { itemToSlugName, interestTypeNameToId } from '../../components/shared/utilities/data-model';
import { getDatamodelCount } from './utilities/datamodel';
import PageLayout from '../PageLayout';
import { removeItCallback, updateCallBack } from './utilities/data-model-page-callbacks';

const collection = Interests; // the collection to use.

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: Interest): DescriptionPair[] => [
  { label: 'Description', value: item.description },
  { label: 'Interest Type', value: InterestTypes.findDoc(item.interestTypeID).name },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: Interest): string => `${item.name} (${itemToSlugName(item)})`;

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

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelInterestsPage: React.FC<AdminDataModelInterestsPageProps> = (props) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

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
    removeItMethod.call({ collectionName, instance }, removeItCallback(setShowUpdateForm, setId, setConfirmOpen));
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
    const updateData: InterestUpdate = doc;
    updateData.id = doc._id;
    if (doc.interestType) {
      updateData.interestType = interestTypeNameToId(doc.interestType);
    }
    // console.log(updateData);
    updateMethod.call({ collectionName, updateData }, updateCallBack(setShowUpdateForm, setId));
  };

  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <PageLayout id="data-model-interests-page" headerPaneTitle="Interests">
      {showUpdateFormState ? (
        <UpdateInterestForm collection={collection} id={idState} handleUpdate={handleUpdate}
                            handleCancel={handleCancel} itemTitleString={itemTitleString}
                            interestTypes={props.interestTypes}/>
      ) : (
        <AddInterestForm interestTypes={props.interestTypes}/>
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
        items={props.items}
      />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete}
               header="Delete Interest?"/>
    </PageLayout>
  );
};

const AdminDataModelInterestsPageContainer = withTracker(() => {
  const items = Interests.find({}).fetch();
  const interestTypes = InterestTypes.find({}).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
    interestTypes,
  };
})(AdminDataModelInterestsPage);

export default AdminDataModelInterestsPageContainer;
