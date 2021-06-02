import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Markdown from 'react-markdown';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import { Interest } from '../../../app/imports/typings/radgrad';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import { Interests } from '../../../app/imports/api/interest/InterestCollection';
import { docToName } from '../../../app/imports/ui/components/shared/utilities/data-model';


export interface Task5SegmentProps {
  interests: Interest[]
}
const Task5Component: React.FC<Task5SegmentProps> = ({ interests }) => {
  const Task5Header = <RadGradHeader title="TASK 5: SHOW ME THE DESCRIPTION" icon = "file alternate outline"/>;
  const [ description, updateDescription ] = useState('');
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
    <RadGradSegment header={Task5Header}>
      <AutoForm schema = {formSchema} onSubmit = {sumbitData} showInlineError>
        <SelectField name="interest" placeholder="Select Interest"/>
        <SubmitField className="mini basic green" value="Display Description"/>
      </AutoForm>
      <RadGradHeader title="description"/>
      <Markdown source={description}/>
    </RadGradSegment>
  );
};
export default withTracker(() => {
  const interests = Interests.findNonRetired();
  return {
    interests,
  };
})(Task5Component);
