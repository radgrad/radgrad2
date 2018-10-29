import * as React from 'react';
import { Form, Input, Button } from 'semantic-ui-react';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(e) {
    console.log(e.target.parentNode.id);
  }

  public render() {
    return (
      <Form>
        <Form.Field required={true}>
          <label>Email</label>
          <Input placeholder="email" />
        </Form.Field>
        <Form.Field required={true}>
          <label>Password</label>
          <Input type={'password'} placeholder="password" />
        </Form.Field>
        <Form.Field>
          <Button type={'submit'}>Submit</Button>
        </Form.Field>
      </Form>

    );
  }
}

export default LoginForm;
