import Swal from 'sweetalert2';

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
    console.error('Error deleting AcademicTerm. %o', error);
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
