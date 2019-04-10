import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import SimpleSchema from 'simpl-schema';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/erasaur:meteor-lodash';

interface IAddAdvisorLogFormProps {
  role: string;
  users: Meteor.User[];
}

class AddAdvisorLogForm extends React.Component<IAddAdvisorLogFormProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Segment padded={true}>
        <Header dividing={true}>Add Advisor Log</Header>
      </Segment>
    );
  }
}

const AddAdvisorLogFormContainer = withTracker((props) => {
  const users = Roles.getUsersInRole(props.role).fetch();
  console.log('users=%o', users);
  return {
    users,
  };
})(AddAdvisorLogForm);

export default AddAdvisorLogFormContainer;
