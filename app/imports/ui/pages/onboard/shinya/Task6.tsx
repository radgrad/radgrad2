import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import { Interest } from '../../../../typings/radgrad';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import { Interests } from '../../../../api/interest/InterestCollection';
import { docToName } from '../../../components/shared/utilities/data-model';
import Task6Edit from './Task6Edit';


export interface Task6SegmentProps {
  interests: Interest[]
}

const Task6: React.FC<Task6SegmentProps> = ({ interests }) => {
  const Task6Header = <RadGradHeader title="TASK 6: EDIT THE DESCRIPTION" icon="pencil" />;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [description, updateDescription] = useState('');
  const sumbitData = (doc) => {
    const selectedInterest = interests.find(interest => doc.interest == interest.name);
    updateDescription(selectedInterest.description);
  };

  const availableInterests = interests.map(docToName);
  const schema = new SimpleSchema({
    interest: {
      type: String,
      allowedValues: availableInterests,
    },
  });

  const formSchema = new SimpleSchema2Bridge(schema);

  return (
    <RadGradSegment header={Task6Header}>
      <AutoForm schema={formSchema} onSubmit={sumbitData} showInlineError>
        <SelectField name="interest" placeholder="Select Interest" />
        <SubmitField className="mini basic green" value="Display Description" />
      </AutoForm>
      <Task6Edit />
    </RadGradSegment>
  );
};
export default withTracker(() => {
  const interests = Interests.findNonRetired();
  return {
    interests,
  };
})(Task6);
