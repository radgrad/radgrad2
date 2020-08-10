import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';

interface IUpdateRegex {
  // eslint-disable-next-line react/no-unused-prop-types
  updateFirstNameRegex: (regex: string) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  updateLastNameRegex: (regex: string) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  updateUserNameRegex: (regex: string) => void;
}

const handleChangeFirstNameRegex = (props: IUpdateRegex) => (event) => {
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
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>First Name</label>
          <Form.Input
            placeholder="First Name Regex"
            name="firstNameRegex"
            onChange={handleChangeFirstNameRegex(props)}
          />
        </Form.Field>
        <Form.Field>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>Last Name</label>
          <Form.Input
            placeholder="Last Name Regex"
            name="lastNameRegex"
            onChange={handleChangeLastNameRegex(props)}
          />
        </Form.Field>
        <Form.Field>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
