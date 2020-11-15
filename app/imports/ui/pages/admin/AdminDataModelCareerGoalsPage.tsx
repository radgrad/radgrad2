import React, { useState } from 'react';
import _ from 'lodash';
import { Confirm, Grid, Icon } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/datamodel-page/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/datamodel-page/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import {
  ICareerGoal, ICareerGoalUpdate,
  IDescriptionPair,
} from '../../../typings/radgrad';
import { Interests } from '../../../api/interest/InterestCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import AdminDataModelUpdateForm from '../../components/admin/datamodel-page/AdminDataModelUpdateForm';
import AddCareerGoalForm from '../../components/admin/datamodel-page/career-goal/AddCareerGoalForm';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { dataModelActions } from '../../../redux/admin/data-model';
import { profileGetCareerGoalIDs, itemToSlugName } from '../../components/shared/utilities/data-model';

function numReferences(careerGoal) {
  let references = 0;
  Users.findProfiles({}, {}).forEach((profile) => {
    if (_.includes(profileGetCareerGoalIDs(profile), careerGoal._id)) {
      references += 1;
    }
  });
  return references;
}

const descriptionPairs = (careerGoal: ICareerGoal): IDescriptionPair[] => [
  { label: 'Description', value: careerGoal.description },
  { label: 'Interests', value: _.sortBy(Interests.findNames(careerGoal.interestIDs)) },
  { label: 'References', value: `Users: ${numReferences(careerGoal)}` },
];

const itemTitleString = (careerGoal: ICareerGoal): string => `${careerGoal.name} (${itemToSlugName(careerGoal)})`;

const itemTitle = (careerGoal: ICareerGoal): React.ReactNode => (
  <React.Fragment>
    {careerGoal.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(careerGoal)}
  </React.Fragment>
);

const AdminDataModelCareerGoalsPage = () => {
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('handleAdd(%o)', doc);
    const collectionName = CareerGoals.getCollectionName();
    const interests = doc.interests;
    const slugs = _.map(interests, (i) => Slugs.getNameFromID(Interests.findDoc({ name: i }).slugID));
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
        // @ts-ignore
        formRef.current.reset();
      }
    });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    // console.log('formRef = %o', formRef);
    // @ts-ignore
    formRef.current.reset();
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
    const updateData: ICareerGoalUpdate = {};
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
        // @ts-ignore
        formRef.current.reset();
        setShowUpdateForm(false);
        setId('');
      }
    });
  };

  const paddedStyle = {
    paddingTop: 20,
  };
  return (
    <div id="data-model-career-goals-page">
      <AdminPageMenuWidget />
      <Grid container stackable style={paddedStyle}>

        <Grid.Column width={3}>
          <AdminDataModelMenu />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <AdminDataModelUpdateForm
              collection={CareerGoals}
              id={idState}
              formRef={formRef}
              handleUpdate={handleUpdate}
              handleCancel={handleCancel}
              itemTitleString={itemTitleString}
            />
          ) : (
            <AddCareerGoalForm collection={CareerGoals} formRef={formRef} handleAdd={handleAdd} />
          )}
          <ListCollectionWidget
            collection={CareerGoals}
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
        header="Delete Career Goal?"
      />

      <BackToTopButton />
    </div>
  );
};

export default AdminDataModelCareerGoalsPage;
