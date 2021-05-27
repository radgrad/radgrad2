import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import Markdown from 'react-markdown';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Interest } from '../../../../typings/radgrad';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import { docToName } from '../../../components/shared/utilities/data-model';

interface Task5Props {
  interests: Interest[];
}

const Task5: React.FC<Task5Props> = ({ interests }) => {
  const header = <RadGradHeader title='TASK 5: SHOW ME THE DESCRIPTION' icon='file alternate outline' dividing/>;
  const [description, updateDescription] = useState('');
  const handleSubmit = (doc) => {
    const selectedInterest = interests.find(interest => doc.interest === interest.name);
    updateDescription(selectedInterest.description);
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
    <RadGradSegment header={header}>
      <AutoForm schema={formSchema} onSubmit={handleSubmit} showInlineError>
        <SelectField name="interest" placeholder="(Select interest)"/>
        <SubmitField className="mini basic green" value="Display Description"/>
      </AutoForm>

      {description ? <div style={{ marginTop: '1rem' }}>
        <h2>Description</h2>
        <Markdown source={description}/>
      </div> : null}
    </RadGradSegment>
  );
};
export default withTracker(() => {
  const interests = Interests.findNonRetired();
  return { interests };
})(Task5);
