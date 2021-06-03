import { withTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import { Interests } from '../../../app/imports/api/interest/InterestCollection';
import { Interest } from '../../../app/imports/typings/radgrad';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import { docToName } from '../../../app/imports/ui/components/shared/utilities/data-model';
import Task6EditDescription from './Task6EditDescription';

interface Task6Props {
  interests: Interest[];
}

const Task6: React.FC<Task6Props> = ({ interests }) => {

  const [myInterest, updateInterest] = useState(null);

  const handleSubmit = (doc) => {
    const selectedInterest = interests.find(interest => doc.interest === interest.name);
    updateInterest(selectedInterest);
  };

  const interestNames = interests.map(docToName);
  const schema = new SimpleSchema({
    interest: {
      type: String,
      allowedValues: interestNames,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <RadGradSegment header={<RadGradHeader title='TASK 6: EDIT THE DESCRIPTION' icon='pencil' dividing />}>
      <AutoForm schema={formSchema} onSubmit={handleSubmit} showInlineError>
        <SelectField name="interest" placeholder="(Select interest)" />
        <SubmitField className="mini basic green" value="Display Description" />
      </AutoForm>

      {myInterest ? <div style={{ marginTop: '1rem' }}>
        <Task6EditDescription interest={myInterest} />
      </div> : null}
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const interests = Interests.findNonRetired();
  return {
    interests,
  };
})(Task6);