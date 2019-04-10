import * as React from 'react';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';
import SelectField from 'uniforms-semantic/SelectField';
import AutoForm from 'uniforms-semantic/AutoForm';

interface IUser {
  _id: string;
  username: string;
  role: string[];
}

interface ISelectUserFieldProps {
  name: string;
  role: string;
  users: IUser[];
}

const SelectUserField = (props: ISelectUserFieldProps) => {
  console.log(props);
  const options = _.map(props.users, (userInfo) => ({ label: userInfo.username, value: userInfo._id }));
  const allowedValues = _.map(props.users, (user) => user.username);
  console.log('options=%o, allowed=%o', options, allowedValues);
  const valueOptions = [{ label: 'value1', value: 'value1' }, { label: 'value2', value: 'value2' }];
  return (
    <SelectField name={props.role.toLowerCase()} allowedValues={['value1', 'value2']} options={valueOptions}/>
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
