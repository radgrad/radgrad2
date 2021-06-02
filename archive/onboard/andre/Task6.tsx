import React, { useState } from 'react';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { withTracker } from 'meteor/react-meteor-data';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';
import { Interest } from '../../../app/imports/typings/radgrad';
import { Interests } from '../../../app/imports/api/interest/InterestCollection';
import { docToName } from '../../../app/imports/ui/components/shared/utilities/data-model';
import Task6EditDescription from './Task6DescriptionEdit';

interface InterestProps {
  interests: Interest[];
}

const Task6Segment: React.FC<InterestProps> = ({ interests }) => {

  const [description, updateDescription] = useState(null);

  const handleSubmit = (doc) => {
    const interestSubmit = interests.find(interest => doc.interest === interest.name);
    updateDescription(interestSubmit);
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
    <RadGradSegment header={<RadGradHeader dividing title='Task 6: Edit The Description' icon='pencil'/>}>
      <AutoForm schema={formSchema} onSubmit={handleSubmit}>
        <SelectField name='interest' placeholder='(Select interest)'/>
        <SubmitField className='mini basic green' value='Display Description'/>
      </AutoForm>
      {description ? <div style={{ marginTop: '1rem' }}>
        <Task6EditDescription interests={description}/>
      </div> : null}
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const interests = Interests.findNonRetired();
  return {
    interests,
  };
})(Task6Segment);