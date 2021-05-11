import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, SubmitField, SelectField } from 'uniforms-semantic';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Interest } from '../../../../typings/radgrad';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import Task6EditDescription from './Task6EditDescription';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';

interface Task6Props {
  interests: Interest[];
}

const Task6: React.FC<Task6Props> = ({ interests }) => {
  const header = <RadGradHeader title="Task 6: Edit the description" icon='pen' />;
  const interestNames = interests.map(interest => interest.name);
  const schema = new SimpleSchema({
    interest: { type: String, allowedValues: interestNames },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const [description, setDescription] = useState('');
  const [id, setId] = useState('');

  const onSubmit = ({ interest }) => {
    const doc = Interests.findDoc(interest);
    setDescription(doc.description);
    setId(doc._id);
  };

  const onEditDescription = (newDescription) => {
    const updateData = { id, description: newDescription };
    updateMethod.callPromise({ collectionName: Interests.getCollectionName(), updateData })
      .then((result) => Swal.fire({ title: 'Description Updated', icon: 'success' }))
      .catch((error) => Swal.fire({ title: 'Update Failed', text: error.message, icon: 'error' }));
  };

  return (
    <RadGradSegment header={header}>
      <AutoForm schema={formSchema} onSubmit={onSubmit} >
        <SelectField name="interest" placeholder="(Select interest)" showInlineError/>
        <SubmitField className="mini basic green" value="Display Description" />
      </AutoForm>
      {description && <Task6EditDescription description={description} onEditDescription={onEditDescription}/>}
    </RadGradSegment>
  );
};

const Task6Container = withTracker(() => {
  const interests = Interests.findNonRetired();
  return { interests };
})(Task6);

export default Task6Container;
