import Swal from 'sweetalert2';

class RadGradAlert {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  success(title, timer) {
    Swal.fire({
      title: title,
      icon: 'success',
      timer: timer,
      showConfirmButton: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  failure(title, text, timer, error) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      timer: timer,
    });
    console.error('Error Alert:', error);
  }
}


export default RadGradAlert;

