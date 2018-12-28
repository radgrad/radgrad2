import * as React from 'react';
import { Popup  } from 'semantic-ui-react';
import LoginForm from './LoginForm';

class LoginDialog extends React.Component {
  public render() {
    console.log('LoginForm.render');
    return (
      <Popup>
        <LoginForm/>
      </Popup>
    );
  }
}

export default LoginDialog;
