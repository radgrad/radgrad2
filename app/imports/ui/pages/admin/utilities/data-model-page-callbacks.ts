import Swal from 'sweetalert2';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';

export const updateCallBack = (setShowUpdateForm, setId) => (error) => {
  if (error) {
    Swal.fire({
      title: 'Update failed',
      text: error.message,
      icon: 'error',
    });
    console.error('Error in updating. %o', error);
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
};

export const removeItCallback = (setShowUpdateForm, setId, setConfirmOpen) => (error) => {
  if (error) {
    Swal.fire({
      title: 'Delete failed',
      text: error.message,
      icon: 'error',
    });
    console.error('Error deleting. %o', error);
  } else {
    Swal.fire({
      title: 'Delete succeeded',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    });

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
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};
