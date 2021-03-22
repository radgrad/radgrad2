import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import _ from 'lodash';
import { Confirm, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import { CareerGoal, CareerGoalUpdate, DescriptionPair, Interest } from '../../../typings/radgrad';
import { Interests } from '../../../api/interest/InterestCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import AdminDataModelUpdateForm from '../../components/admin/datamodel/AdminDataModelUpdateForm';
import AddCareerGoalForm from '../../components/admin/datamodel/career-goal/AddCareerGoalForm';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { dataModelActions } from '../../../redux/admin/data-model';
import { profileGetCareerGoalIDs, itemToSlugName } from '../../components/shared/utilities/data-model';
import { getDatamodelCount } from './utilities/datamodel';
import PageLayout from '../PageLayout';

const numReferences = (careerGoal) => {
  let references = 0;
  Users.findProfiles({}, {}).forEach((profile) => {
    if (_.includes(profileGetCareerGoalIDs(profile), careerGoal._id)) {
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
const AdminDataModelCareerGoalsPage: React.FC<AdminDataModelCareerGoalsPageProps> = (props) => {
  // TODO deconstruct props
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = CareerGoals.getCollectionName();
    const interests = doc.interests;
    const slugs = interests.map((i) => Slugs.getNameFromID(Interests.findDoc({ name: i }).slugID));
    const definitionData = doc;
    definitionData.interests = slugs;
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
      }
    });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    // console.log('formRef = %o', formRef);
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
    const collectionName = CareerGoals.getCollectionName();
    const instance = idState;
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Delete failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Error deleting CareerGoal. %o', error);
      } else {
        Swal.fire({
          title: 'Delete succeeded',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setConfirmOpen(false);
      setId('');
    });
  };

  const handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o ref=%o', inst, formRef);
    setShowUpdateForm(true);
    setId(inst.id);
  };

  const handleUpdate = (doc) => {
    // console.log('handleUpdate(%o) ref=%o', doc, formRef);
    const collectionName = CareerGoals.getCollectionName();
    const updateData: CareerGoalUpdate = {};
    updateData.id = doc._id;
    updateData.name = doc.name;
    updateData.description = doc.description;
    updateData.retired = doc.retired;
    updateData.interests = doc.interests;
    // console.log('updateData = %o', updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          icon: 'error',
        });
        console.error('Update failed', error);
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

  return (
    <PageLayout id="data-model-career-goals-page" headerPaneTitle="Career Goals">
      {showUpdateFormState ? (
        <AdminDataModelUpdateForm collection={CareerGoals} id={idState} formRef={formRef} handleUpdate={handleUpdate}
                                  handleCancel={handleCancel} itemTitleString={itemTitleString}/>
      ) : (
        <AddCareerGoalForm formRef={formRef} handleAdd={handleAdd} interests={props.interests}/>
      )}
      <ListCollectionWidget
        collection={CareerGoals}
        descriptionPairs={descriptionPairs}
        itemTitle={itemTitle}
        handleOpenUpdate={handleOpenUpdate}
        handleDelete={handleDelete}
        setShowIndex={dataModelActions.setCollectionShowIndex}
        setShowCount={dataModelActions.setCollectionShowCount}
        items={props.items}
      />

      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete}
               header="Delete Career Goal?"/>
    </PageLayout>
  );
};

const AdminDataModelCareerGoalsPageContainer = withTracker(() => {
  const items = CareerGoals.find({}).fetch();
  const interests = Interests.find({}).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
    interests,
  };
})(AdminDataModelCareerGoalsPage);

export default AdminDataModelCareerGoalsPageContainer;
