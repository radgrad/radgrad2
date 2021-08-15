import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { InterestKeywords } from '../../../api/interest/InterestKeywordCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { DescriptionPair, Interest, InterestKeyword, InterestKeywordUpdate } from '../../../typings/radgrad';
import AddInterestKeywordForm from '../../components/admin/datamodel/interest/AddInterestKeywordForm';
import UpdateInterestKeywordForm from '../../components/admin/datamodel/interest/UpdateInterestKeywordForm';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { PAGEIDS } from '../../utilities/PageIDs';
import RadGradAlert from '../../utilities/RadGradAlert';
import PageLayout from '../PageLayout';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';

interface AdminDataModelInterestKeywordsPageProps {
  interests: Interest[];
  items: InterestKeyword[];
}

const collection = InterestKeywords;

const descriptionPairs = (interestKeyword: InterestKeyword): DescriptionPair[] => [
  { label: 'Interest', value: Interests.findDoc(interestKeyword.interestID).name },
  { label: 'Keyword', value: interestKeyword.keyword },
  { label: 'Retired', value: interestKeyword.retired ? 'True' : 'False' },
];

const itemTitleString = (interestKeyword: InterestKeyword): string => `${Interests.findDoc(interestKeyword.interestID).name} - ${interestKeyword.keyword}`;

const itemTitle = (interestKeyword: InterestKeyword): React.ReactNode => (
  <React.Fragment>
    {interestKeyword.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(interestKeyword)}
  </React.Fragment>
);

const AdminDataModelInterestKeywordsPage: React.FC<AdminDataModelInterestKeywordsPageProps> = ({ interests, items }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    const collectionName = collection.getCollectionName();
    const updateData: InterestKeywordUpdate = {};
    updateData.id = doc._id;
    updateData.keyword = doc.keyword;
    updateData.retired = doc.retired;
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
    <PageLayout id={PAGEIDS.DATA_MODEL_INTEREST_KEYWORDS} headerPaneTitle="Interest Keywords">
      {showUpdateFormState ? <UpdateInterestKeywordForm id={idState}  handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} /> : <AddInterestKeywordForm interests={interests} />}
      <ListCollectionWidget collection={InterestKeywords} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Interest Keyword?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  const interests = Interests.find({}, { sort: { name: 1 } }).fetch();
  let items = InterestKeywords.find({}).fetch();
  items = _.sortBy(items, (ik) => Interests.findDoc(ik.interestID).name);
  return { interests, items };
})(AdminDataModelInterestKeywordsPage);
