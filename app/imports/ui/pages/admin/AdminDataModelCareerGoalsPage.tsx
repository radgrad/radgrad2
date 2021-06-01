import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import _ from 'lodash';
import { Confirm, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import { CareerGoal, CareerGoalUpdate, DescriptionPair, Interest } from '../../../typings/radgrad';
import { Interests } from '../../../api/interest/InterestCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import AddCareerGoalForm from '../../components/admin/datamodel/career-goal/AddCareerGoalForm';
import UpdateCareerGoalForm from '../../components/admin/datamodel/career-goal/UpdateCareerGoalForm';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import {
  profileGetCareerGoalIDs,
  itemToSlugName,
  interestNameToId,
} from '../../components/shared/utilities/data-model';
import { PAGEIDS } from '../../utilities/PageIDs';
import {
  handleCancelWrapper,
  handleConfirmDeleteWrapper,
  handleDeleteWrapper, handleOpenUpdateWrapper,
} from './utilities/data-model-page-callbacks';
import PageLayout from '../PageLayout';

const collection = CareerGoals;

const numReferences = (careerGoal) => {
  let references = 0;
  Users.findProfiles({}, {}).forEach((profile) => {
    if ((profileGetCareerGoalIDs(profile)).includes(careerGoal._id)) {
      references += 1;
    }
  });
  return references;
};

const descriptionPairs = (careerGoal: CareerGoal): DescriptionPair[] => [
  { label: 'Description', value: careerGoal.description },
  { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
  { label: 'References', value: `Users: ${numReferences(careerGoal)}` },
];

const itemTitleString = (careerGoal: CareerGoal): string => `${careerGoal.name} (${itemToSlugName(careerGoal)})`;

const itemTitle = (careerGoal: CareerGoal): React.ReactNode => (
  <React.Fragment>
    {careerGoal.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(careerGoal)}
  </React.Fragment>
);

interface AdminDataModelCareerGoalsPageProps {
  items: CareerGoal[];
  interests: Interest[];
}

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelCareerGoalsPage: React.FC<AdminDataModelCareerGoalsPageProps> = ({ items, interests }) => {
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
    const updateData: CareerGoalUpdate = {};
    updateData.id = doc._id;
    updateData.picture = doc.picture;
    updateData.name = doc.name;
    updateData.description = doc.description;
    updateData.retired = doc.retired;
    updateData.interests = doc.interests.map(interestNameToId);
    // console.log('updateData = %o', updateData);
    updateMethod.callPromise({ collectionName, updateData })
      .catch((error) => {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error in updating. %o', error);
      })
      .then(() => {
        Swal.fire({
          title: 'Update succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
        setShowUpdateForm(false);
        setId('');
      });
  };

  return (
    <PageLayout id={PAGEIDS.DATA_MODEL_CAREER_GOALS} headerPaneTitle="Career Goals">
      {showUpdateFormState ? (
        <UpdateCareerGoalForm collection={CareerGoals} id={idState} handleUpdate={handleUpdate}
          handleCancel={handleCancel} itemTitleString={itemTitleString}
          interests={interests} />
      ) : (
        <AddCareerGoalForm interests={interests} />
      )}
      <ListCollectionWidget
        collection={CareerGoals}
        descriptionPairs={descriptionPairs}
        itemTitle={itemTitle}
        handleOpenUpdate={handleOpenUpdate}
        handleDelete={handleDelete}
        items={items}
      />

      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete}
        header="Delete Career Goal?" />
    </PageLayout>
  );
};

const AdminDataModelCareerGoalsPageContainer = withTracker(() => {
  const items = CareerGoals.find({}).fetch();
  const interests = Interests.find({}).fetch();
  return {
    items,
    interests,
  };
})(AdminDataModelCareerGoalsPage);

export default AdminDataModelCareerGoalsPageContainer;
