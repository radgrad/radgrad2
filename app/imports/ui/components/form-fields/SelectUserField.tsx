import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Form, Label, Select } from 'semantic-ui-react';

interface IUser {
  _id: string;
  username: string;
  role: string[];
}

interface ISelectUserFieldProps {
  label: string;
  name: string;
  required?: boolean;
  role: string;
  users: IUser[];
}

const SelectUserField = (props: ISelectUserFieldProps) => {
  console.log(props);
  const options = _.map(props.users, (userInfo) => ({ key: userInfo._id, text: userInfo.name, value: userInfo._id }));
  console.log(options);
  return (
    <Form.Select label={props.label} options={options} placeholder={`Select ${props.role}`}
                required={props.required}/>
  );
};

const SelectUserFieldContainer = withTracker((props) => {
  const users = Roles.getUsersInRole(props.role).fetch();
  console.log('users=%o', users);
  return {
    users,
  };
})(SelectUserField);
export default SelectUserFieldContainer;
