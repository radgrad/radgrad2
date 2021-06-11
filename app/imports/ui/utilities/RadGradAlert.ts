import Swal from 'sweetalert2';

class RadGradAlert {

  static success(title: string, text?: string): void {
    Swal.fire({
      title: title,
      text: text,
      timer: 2000,
      icon: 'success',
      iconColor: '#38840F',
      showConfirmButton: false,
      backdrop: 'rgba(52, 140, 114, 0.4)',
    });
  }

  static failure(title: string, text: string, error?: string): void {
    if (error === undefined) {
      Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        iconColor: '#CA4864',
        timer: 3000,
        backdrop: 'rgba(52, 140, 114, 0.4)',
      });
    } else {
      Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        iconColor: '#CA4864',
        timer: 3000,
        backdrop: 'rgba(52, 140, 114, 0.4)',
      });
      console.error('Error Alert:', error);
    }
  }
}


export default RadGradAlert;

