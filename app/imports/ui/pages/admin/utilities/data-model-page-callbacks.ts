import RadGradAlert from '../../../utilities/RadGradAlert';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';


export const updateCallBack = (setShowUpdateForm, setId) => (error) => {
  if (error) {
    RadGradAlert.failure('Update failed', error.message, error);
  } else {
    RadGradAlert.success('Update succeeded');
    setShowUpdateForm(false);
    setId('');
  }
};

export const removeItCallback = (setShowUpdateForm, setId, setConfirmOpen) => (error) => {
  if (error) {
    RadGradAlert.failure('Delete failed', error.message, error);
  } else {
    RadGradAlert.success('Delete succeeded');
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
  // console.log('handleConfirmDeleteWrapper', collectionName, idState);
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
  scrollToTop();
};

export const scrollToTop = () => {
  window.scroll({ top: 0, left: 0, behavior: 'smooth' });
};
