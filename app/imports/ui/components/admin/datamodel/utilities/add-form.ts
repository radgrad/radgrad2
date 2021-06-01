import RadGradAlert from '../../../../utilities/RadGradAlert';

export const defineCallback = (ref) => (error) => {
  if (error) {
    RadGradAlert.failure('Add failed', error.message, error);
  } else {
    RadGradAlert.success('Add succeeded');
    ref.reset();
  }
};
