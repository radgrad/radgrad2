import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CareerGoalKeywords } from '../../../api/career/CareerGoalKeywordCollection';
import { CareerGoal, CareerGoalKeyword, CareerGoalKeywordUpdate, DescriptionPair } from '../../../typings/radgrad';
import AddCareerGoalKeywordForm from '../../components/admin/datamodel/career-goal/AddCareerGoalKeywordForm';
import UpdateCareerGoalKeywordForm from '../../components/admin/datamodel/career-goal/UpdateCareerGoalKeywordForm';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { PAGEIDS } from '../../utilities/PageIDs';
import RadGradAlert from '../../utilities/RadGradAlert';
import PageLayout from '../PageLayout';
import { handleCancelWrapper, handleConfirmDeleteWrapper, handleDeleteWrapper, handleOpenUpdateWrapper } from './utilities/data-model-page-callbacks';

interface AdminDataModelCareerGoalKeywordsPageProps {
  careerGoals: CareerGoal[];
  items: CareerGoalKeyword[];
}

const collection = CareerGoalKeywords;

const descriptionPairs = (careerGoalKeyword: CareerGoalKeyword): DescriptionPair[] => [
  { label: 'Career Goal', value: CareerGoals.findDoc(careerGoalKeyword.careerGoalID).name },
  { label: 'Keyword', value: careerGoalKeyword.keyword },
  { label: 'Retired', value: careerGoalKeyword.retired ? 'True' : 'False' },
];

const itemTitleString = (careerGoalKeyword: CareerGoalKeyword): string => `${CareerGoals.findDoc(careerGoalKeyword.careerGoalID).name} - ${careerGoalKeyword.keyword}`;

const itemTitle = (careerGoalKeyword: CareerGoalKeyword): React.ReactNode => (
  <React.Fragment>
    {careerGoalKeyword.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(careerGoalKeyword)}
  </React.Fragment>
);

const AdminDataModelCareerGoalKeywordsPage: React.FC<AdminDataModelCareerGoalKeywordsPageProps> = ({ careerGoals, items }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleCancel = handleCancelWrapper(setConfirmOpen, setId, setShowUpdateForm);
  const handleConfirmDelete = handleConfirmDeleteWrapper(collection.getCollectionName(), idState, setShowUpdateForm, setId, setConfirmOpen);
  const handleDelete = handleDeleteWrapper(setConfirmOpen, setId);
  const handleOpenUpdate = handleOpenUpdateWrapper(setShowUpdateForm, setId);

  const handleUpdate = (doc) => {
    const collectionName = collection.getCollectionName();
    const updateData: CareerGoalKeywordUpdate = {};
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
    <PageLayout id={PAGEIDS.DATA_MODEL_CAREER_GOAL_KEYWORDS} headerPaneTitle="Career Goal Keywords">
      {showUpdateFormState ? <UpdateCareerGoalKeywordForm id={idState}  handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} /> : <AddCareerGoalKeywordForm careerGoals={careerGoals} />}
      <ListCollectionWidget collection={CareerGoalKeywords} descriptionPairs={descriptionPairs} itemTitle={itemTitle} handleOpenUpdate={handleOpenUpdate} handleDelete={handleDelete} items={items} />
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Career Goal Keyword?" />
    </PageLayout>
  );
};

export default withTracker(() => {
  const careerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  let items = CareerGoalKeywords.find({}).fetch();
  items = _.sortBy(items, (cgk) => CareerGoals.findDoc(cgk.careerGoalID).name);
  return { careerGoals, items };
})(AdminDataModelCareerGoalKeywordsPage);
