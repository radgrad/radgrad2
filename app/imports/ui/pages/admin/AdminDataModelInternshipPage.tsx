import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Interests } from '../../../api/interest/InterestCollection';
import { Internships } from '../../../api/internship/InternshipCollection';
import { DescriptionPair, Interest, Internship, InternshipUpdateData } from '../../../typings/radgrad';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { interestSlugFromName } from '../../components/shared/utilities/form';
import RadGradAlert from '../../utilities/RadGradAlert';
import PageLayout from '../PageLayout';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';
import { PAGEIDS } from '../../utilities/PageIDs';

const collection = Internships;

const descriptionPairs = (item: Internship): DescriptionPair[] => {
  const retVal = [
    { label: 'Position', value: item.position },
    { label: 'Company', value: item.company ? item.company : 'N/A' },
    { label: 'Description', value: item.description },
    { label: 'Interests', value: Interests.findNames(item.interestIDs).sort() },
    { label: 'Missed Uploads', value: item.missedUploads },
  ];
  return retVal;
};

const itemTitleString = (item: Internship): string => `${item.position}: ${item.company}`;

const itemTitle = (item: Internship): React.ReactNode => (
  <React.Fragment>
    {item.missedUploads > 8 ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelInternshipPageProps {
  items: Internship[];
  interests: Interest[];
}

const AdminDataModelInternshipPage: React.FC<AdminDataModelInternshipPageProps> = ({ items, interests }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    const collectionName = collection.getCollectionName();
    const updateData: InternshipUpdateData = doc;
    updateData.id = doc._id;
    updateData.interests = doc.interests.map(interestSlugFromName);
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
    <PageLayout id={PAGEIDS.DATA_MODEL_INTERNSHIPS} headerPaneTitle="Internships">
      {/* <ListCollectionWidget collection={collection} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} /> */}

      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Internship?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  const items = Internships.find({}).fetch();
  return {
    interests,
    items,
  };
});
