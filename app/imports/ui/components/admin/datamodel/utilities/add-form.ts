import Swal from 'sweetalert2';

export   const callback = (ref) => (error) => {
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
    ref.reset();
  }
};
