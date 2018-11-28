import * as React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';

interface IUpdateRegex {
  updateFirstNameRegex: (regex: string) => void;
  updateLastNameRegex: (regex: string) => void;
  updateUserNameRegex: (regex: string) => void;
}

class FilterUserWidget extends React.Component<IUpdateRegex> {
  constructor(props) {
    super(props);
    this.handleChangeFirstNameRegex = this.handleChangeFirstNameRegex.bind(this);
    this.handleChangeLastNameRegex = this.handleChangeLastNameRegex.bind(this);
    this.handleChangeUserNameRegex = this.handleChangeFirstNameRegex.bind(this);
  }

  public handleChangeFirstNameRegex(event, value) {
    console.log(event, value);
    this.props.updateFirstNameRegex(event.target.value);
  }

  public handleChangeLastNameRegex(event) {
    this.props.updateLastNameRegex(event.target.value);
  }

  public handleChangeUserNameRegex(event) {
    this.props.updateUserNameRegex(event.target.value);
  }

  public render() {
    return (
      <Segment>
        <Header as="h4" dividing={true}>FILTER USERS</Header>
        <Form>
          <Form.Group widths="equal">
            <Form.Field>
              <label>First Name</label>
              <Form.Input placeholder="First Name Regex" name="firstNameRegex"
                          onChange={this.handleChangeFirstNameRegex}/>
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <Form.Input placeholder="Last Name Regex" name="lastNameRegex"
                          onChange={this.handleChangeLastNameRegex}/>
            </Form.Field>
            <Form.Field>
              <label>Username</label>
              <Form.Input placeholder="Username Regex" name="userNameRegex"
                          onChange={this.handleChangeUserNameRegex}/>
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
    );
  }
}

export default FilterUserWidget;
