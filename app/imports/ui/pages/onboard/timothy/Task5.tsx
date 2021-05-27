import React, { useState } from 'react';
import { Header } from 'semantic-ui-react';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Markdown from 'react-markdown';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Interest } from '../../../../typings/radgrad';
import { docToName } from '../../../components/shared/utilities/data-model';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

interface Task5Props {
  totalInterests: Interest[],
}

const Task5: React.FC<Task5Props> = ({ totalInterests }) => {
  const interestNameList = totalInterests.map(docToName);
  const schema = new SimpleSchema({
    interest: {
      type: String,
      allowedValues: interestNameList,
    },
  });
  const [selectDescription, setSelectDescription] = useState(() =>'');
  const formSchema = new SimpleSchema2Bridge(schema);

  const submit = (doc) => {
    const selectInterest = totalInterests.find(interest => doc.interest === interest.name);
    setSelectDescription(selectInterest.description);
  };

  const DisplayDescription = () => (
    <div>
      <Markdown escapeHtml source={selectDescription} />
    </div>
  );

  return (
    <RadGradSegment header={<RadGradHeader title='TASK 5: SHOW ME THE DESCRIPTION' icon='file alternate outline'/>}>
      <Header dividing>Add Career Goal</Header>
      <AutoForm schema={formSchema} onSubmit={submit}>
        <SelectField name="interest" placeholder="(Select interest)"/>
        <SubmitField className="mini basic green" value='Display Description'/>
      </AutoForm>
      <DisplayDescription/>
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const totalInterests = Interests.findNonRetired();
  return {
    totalInterests,
  };
})(Task5);
