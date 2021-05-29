import RadGradAlerts from '../../../utilities/RadGradAlert';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';

const RadGradAlert = new RadGradAlerts();

export const updateCallBack = (setShowUpdateForm, setId) => (error) => {
  if (error) {
    RadGradAlert.failure('Update failed', error.message, 2500, error);
  } else {
    RadGradAlert.success('Update succeeded', '', 1500);
    setShowUpdateForm(false);
    setId('');
  }
};

export const removeItCallback = (setShowUpdateForm, setId, setConfirmOpen) => (error) => {
  if (error) {
    RadGradAlert.failure('Delete failed', error.message, 2500, error);
  } else {
    RadGradAlert.success('Delete succeeded', '', 1500);
  }
  setShowUpdateForm(false);
  setId('');
  setConfirmOpen(false);
};

export const handleCancelWrapper = (setConfirmOpen, setId, setShowUpdateForm) => (event) => {
  event.preventDefault();
  setConfirmOpen(false);
  setId('');
  setShowUpdateForm(false);
};

export const handleConfirmDeleteWrapper = (collectionName, idState, setShowUpdateForm, setId, setConfirmOpen) => () => {
  const instance = idState;
  removeItMethod.call({ collectionName, instance }, removeItCallback(setShowUpdateForm, setId, setConfirmOpen));
};

export const handleDeleteWrapper = (setConfirmOpen, setId) => (event, inst) => {
  event.preventDefault();
  // console.log('handleDelete inst=%o', inst);
  setConfirmOpen(true);
  setId(inst.id);
};

export const handleOpenUpdateWrapper = (setShowUpdateForm, setId) => (evt, inst) => {
  evt.preventDefault();
  // console.log('handleOpenUpdate inst=%o', evt, inst);
  setShowUpdateForm(true);
  setId(inst.id);
};
