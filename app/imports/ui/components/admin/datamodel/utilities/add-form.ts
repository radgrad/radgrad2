import RadGradAlerts from '../../../../utilities/RadGradAlert';

const RadGradAlert = new RadGradAlerts();

export const defineCallback = (ref) => (error) => {
  if (error) {
    RadGradAlert.failure('Add failed', error.message, 2500, error);
  } else {
    RadGradAlert.success('Add succeeded', '', 1500);
    ref.reset();
  }
};
