import { withRouter } from 'react-router-dom';

function withUsernameHOC(WrappedComponent) {
  return withRouter(WrappedComponent);
}

export default withUsernameHOC;
