import React, { useState } from 'react';
import { Header } from 'semantic-ui-react';
import { AutoForm, SelectField, SubmitField } from 'uniforms-semantic';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Task6EditDescription from './Task6EditDescription';
import { Interests } from '../../../../api/interest/InterestCollection';
import { docToName } from '../../../components/shared/utilities/data-model';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

interface OnBoardVar {
  totalInterests: [],
}

const Task6: React.FC<OnBoardVar> = ({ totalInterests }) => {
  const interestNameList = totalInterests.map(docToName);
  const schema = new SimpleSchema({
    interest: {
      type: String,
      allowedValues: interestNameList,
    },
  });
  const [selectInterest, setSelectInterest] = useState(() =>'');
  const formSchema = new SimpleSchema2Bridge(schema);

  const Submit = (data) => {
    const { interest } = data;
    setSelectInterest(interest);
  };

  const DisplayInterest = () => {
    const interestName = selectInterest;
    const interestDesc = _.map(Interests.find({ name: interestName }).fetch(), 'description')[0];
    return (
    <div>
      <Task6EditDescription interestDesc={interestDesc} interestName={interestName}/>
    </div>
    );
  };

  return (
  <RadGradSegment header={<RadGradHeader title='TASK 6: EDIT THE DESCRIPTION' icon='file alternate outline'/>}>
    <Header dividing>Add Career Goal</Header>
    {/* eslint-disable-next-line no-return-assign */}
    <AutoForm schema={formSchema} onSubmit={data => Submit(data)}>
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
