import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, SubmitField, SelectField } from 'uniforms-semantic';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Interest } from '../../../../typings/radgrad';
import MultiSelectField from '../../../components/form-fields/MultiSelectField';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

interface Task5Props {
  interests: Interest[];
}

const Task5: React.FC<Task5Props> = ({ interests }) => {
  const header = <RadGradHeader title="Task 5: A simple form" icon='file alternate outline' />;
  const interestNames = interests.map(interest => interest.name);
  const schema = new SimpleSchema({
    interest: { type: String, allowedValues: interestNames },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const onSubmit = ({ interest }) => {

  }

  return (
    <RadGradSegment header={header}>
      <AutoForm schema={formSchema} onSubmit={onSubmit} >
        <SelectField name="interest" placeholder="(Select interest)" showInlineError/>
        <SubmitField className="mini basic green" value="Select Interest" />
      </AutoForm>
    </RadGradSegment>
  );
};

const Task5Container = withTracker(() => {
  const interests = Interests.findNonRetired();
  return { interests };
})(Task5);

export default Task5Container;
