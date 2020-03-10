import React from 'react';
import { AutoForm } from 'uniforms-semantic/';
import SimpleSchema from 'simpl-schema';
import RadioField from '../form-fields/RadioField';

export const opportunitySortKeys = {
  alphabetic: 'alphabetic',
  innovation: 'innovation',
  experience: 'experience',
  match: 'match',
};

interface IOpportunitySortWidgetProps {
  sortChoice: string;
  handleChange: (key: string, value: string) => any;
}

const OpportunitySortWidget = (props: IOpportunitySortWidgetProps) => {
  // console.log('OpportunitySortWidget', props);
  const schema = new SimpleSchema({
    sortOpportunitiesBy: {
      type: String,
      allowedValues: [
        opportunitySortKeys.alphabetic,
        opportunitySortKeys.experience,
        opportunitySortKeys.innovation,
        opportunitySortKeys.match,
      ],
      optional: true,
    },
  });
  const model = {
    sortOpportunitiesBy: props.sortChoice,
  };
  return (
    <div>
      <AutoForm schema={schema} model={model} onChange={props.handleChange}>
        <RadioField name="sortOpportunitiesBy" inline />
      </AutoForm>
    </div>
  );
};

export default OpportunitySortWidget;
