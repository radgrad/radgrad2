import React, { useState } from 'react';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { withTracker } from 'meteor/react-meteor-data';
import Markdown from 'react-markdown';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { Interest } from '../../../../typings/radgrad';
import { Interests } from '../../../../api/interest/InterestCollection';
import { docToName } from '../../../components/shared/utilities/data-model';

interface InterestProps {
  interests: Interest[]
}

const Task5Segment: React.FC<InterestProps> = ({ interests }) => {

  const [description, updateDescription] = useState('');
  const handleSubmit = (doc) => {
    const interestSubmit = interests.find(interest => doc.interest === interest.name);
    updateDescription(interestSubmit.description);
  };

  const interestNames = interests.map(docToName);
  const interestSchema = new SimpleSchema({
    interest: {
      type: String,
      allowedValues: interestNames,
    },
  });
  const formSchema = new SimpleSchema2Bridge(interestSchema);

  return (
    <RadGradSegment header={<RadGradHeader dividing title='Task 5: Show Me The Description' icon='file alternate outline'/>}>
      <AutoForm schema={formSchema} onSubmit={handleSubmit}>
        <SelectField name='interest' placeholder='(Select interest)'/>
        <SubmitField className='mini basic green' value='Display Description'/>
      </AutoForm>
      <h3> Description </h3>
      <Markdown source={description}/>
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const interests = Interests.findNonRetired();
  return {
    interests,
  };
})(Task5Segment);