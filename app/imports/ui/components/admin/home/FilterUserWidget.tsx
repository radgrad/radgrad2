import React from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';

interface UpdateRegex {
  updateFirstNameRegex: (regex: string) => void;
  updateLastNameRegex: (regex: string) => void;
  updateUserNameRegex: (regex: string) => void;
}

const handleChangeFirstNameRegex = (updateFirstNameRegex: (regex: string) => void) => (event) => {
  updateFirstNameRegex(event.target.value);
};

const handleChangeLastNameRegex = (updateLastNameRegex: (regex: string) => void) => (event) => {
  updateLastNameRegex(event.target.value);
};

const handleChangeUserNameRegex = (updateUserNameRegex: (regex: string) => void) => (event) => {
  updateUserNameRegex(event.target.value);
};

const FilterUserWidget: React.FC<UpdateRegex> = ({ updateFirstNameRegex, updateLastNameRegex, updateUserNameRegex }) => (
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
            onChange={handleChangeFirstNameRegex(updateFirstNameRegex)}
          />
        </Form.Field>
        <Form.Field>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>Last Name</label>
          <Form.Input
            placeholder="Last Name Regex"
            name="lastNameRegex"
            onChange={handleChangeLastNameRegex(updateLastNameRegex)}
          />
        </Form.Field>
        <Form.Field>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>Username</label>
          <Form.Input
            placeholder="Username Regex"
            name="userNameRegex"
            onChange={handleChangeUserNameRegex(updateUserNameRegex)}
          />
        </Form.Field>
      </Form.Group>
    </Form>
  </Segment>
);

export default FilterUserWidget;
