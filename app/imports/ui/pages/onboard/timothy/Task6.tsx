import React, { useState } from 'react';
import { Header } from 'semantic-ui-react';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import Task6EditDescription from './Task6EditDescription';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Interest } from '../../../../typings/radgrad';
import { docToName } from '../../../components/shared/utilities/data-model';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import { updateMethod } from '../../../../api/base/BaseCollection.methods';

interface Task6Prop {
  totalInterests: Interest[],
}

const Task6: React.FC<Task6Prop> = ({ totalInterests }) => {
  const interestNameList = totalInterests.map(docToName);
  const schema = new SimpleSchema({
    interest: {
      type: String,
      allowedValues: interestNameList,
    },
  });
  const [selectDescription, setSelectDescription] = useState(() =>'');
  const [selectID, setSelectID] = useState(() =>'');
  const formSchema = new SimpleSchema2Bridge(schema);

  const submit = (doc) => {
    const selectInterest = totalInterests.find(interest => doc.interest === interest.name);
    setSelectDescription(selectInterest.description);
    setSelectID(selectInterest._id);
  };

  const updateDesc = (doc) => {
    const collectionName = Interests.getCollectionName();
    const updateData = doc;
    updateData.id = selectID;

    updateMethod.callPromise({ collectionName, updateData })
      .then((result) => Swal.fire({
        title: 'Interest Updated',
        icon: 'success',
        text: 'Successfully updated interest.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        timer: 1500,
      }))
      .catch((error) => Swal.fire({
        title: 'Update Failed',
        text: error.message,
        icon: 'error',
        // timer: 1500,
      }));
  };

  const DisplayInterest = () => (
    <div>
      <Task6EditDescription interestDesc={selectDescription} updateDesc={updateDesc}/>
    </div>
  );

  return (
  <RadGradSegment header={<RadGradHeader title='TASK 6: EDIT THE DESCRIPTION' icon='file alternate outline'/>}>
    <Header dividing>Add Career Goal</Header>
    <AutoForm schema={formSchema} onSubmit={submit}>
      <SelectField name="interest" placeholder="(Select interest)"/>
      <SubmitField className="mini basic green" value='Display Description'/>
    </AutoForm>
    <DisplayInterest/>
  </RadGradSegment>
  );
};

export default withTracker(() => {
  const totalInterests = Interests.findNonRetired();
  return {
    totalInterests,
  };
})(Task6);
