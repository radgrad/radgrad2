import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';

interface IUpdateRegex {
  updateFirstNameRegex: (regex: string) => void;
  updateLastNameRegex: (regex: string) => void;
  updateUserNameRegex: (regex: string) => void;
}

const handleChangeFirstNameRegex = (props: IUpdateRegex) => (event, value) => {
  console.log(event, value);
  props.updateFirstNameRegex(event.target.value);
};

const handleChangeLastNameRegex = (props: IUpdateRegex) => (event) => {
  props.updateLastNameRegex(event.target.value);
};

const handleChangeUserNameRegex = (props: IUpdateRegex) => (event) => {
  props.updateUserNameRegex(event.target.value);
};

const FilterUserWidget = (props: IUpdateRegex) => (
  <Segment>
    <Header as="h4" dividing>FILTER USERS</Header>
    <Form>
      <Form.Group widths="equal">
        <Form.Field>
          <label>First Name</label>
          <Form.Input
            placeholder="First Name Regex"
            name="firstNameRegex"
            onChange={handleChangeFirstNameRegex(props)}
          />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <Form.Input
            placeholder="Last Name Regex"
            name="lastNameRegex"
            onChange={handleChangeLastNameRegex(props)}
          />
        </Form.Field>
        <Form.Field>
          <label>Username</label>
          <Form.Input
            placeholder="Username Regex"
            name="userNameRegex"
            onChange={handleChangeUserNameRegex(props)}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  </Segment>
);

export default FilterUserWidget;
