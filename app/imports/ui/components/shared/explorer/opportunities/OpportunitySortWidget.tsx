import React from 'react';
import { AutoForm } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import RadioField from '../../../form-fields/RadioField';

export const opportunitySortKeys = {
  recommended: 'Recommended',
  alphabetic: 'Alphabetic',
  innovation: 'Innovation',
  experience: 'Experience',
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
        opportunitySortKeys.recommended,
        opportunitySortKeys.alphabetic,
        opportunitySortKeys.experience,
        opportunitySortKeys.innovation,
      ],
      optional: true,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const model = {
    sortOpportunitiesBy: props.sortChoice,
  };
  return (
    <AutoForm schema={formSchema} model={model} onChange={props.handleChange}>
      <RadioField name="sortOpportunitiesBy" label="Sort Opportunities By:" inline />
    </AutoForm>
  );
};

export default OpportunitySortWidget;
