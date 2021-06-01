import React from 'react';
import { AutoForm, ErrorsField } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useStickyState } from '../../../../utilities/StickyState';
import RadioField from '../../../form-fields/RadioField';
import { EXPLORER_FILTER_KEYS, EXPLORER_TYPE } from '../../../../utilities/ExplorerUtils';

interface FilterProps {
  explorerType: string;
}

const Filter: React.FC<FilterProps> = ({ explorerType }) => {
  const [filterChoice, setFilterChoice] = useStickyState(`Filter.${explorerType}`, EXPLORER_FILTER_KEYS.NONE);

  const handleChange = (type, value) => {
    setFilterChoice(value);
  };

  const explorerFilterValues = (type) => {
    let allowedFilterValues: string[];
    switch (type) {
      case EXPLORER_TYPE.CAREERGOALS:
      case EXPLORER_TYPE.OPPORTUNITIES:
      case EXPLORER_TYPE.INTERESTS:
        allowedFilterValues = [EXPLORER_FILTER_KEYS.NONE, EXPLORER_FILTER_KEYS.INPROFILE, EXPLORER_FILTER_KEYS.NOTINPROFILE];
        break;
      case EXPLORER_TYPE.COURSES:
        allowedFilterValues = [EXPLORER_FILTER_KEYS.NONE, EXPLORER_FILTER_KEYS.INPROFILE, EXPLORER_FILTER_KEYS.THREEHUNDRED, EXPLORER_FILTER_KEYS.FOURHUNDRED, EXPLORER_FILTER_KEYS.SIXHUNDRED];
        break;
    }
    return allowedFilterValues;
  };

  const schema = new SimpleSchema({
    filterBy: {
      type: String,
      allowedValues: explorerFilterValues(explorerType),
      optional: true,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const model = { filterBy: filterChoice };
  return (
    <div>
      <AutoForm schema={formSchema} model={model} onChange={handleChange}>
        <RadioField name="filterBy" label="Filter By:" inline/>
        <ErrorsField/>
      </AutoForm>
    </div>
  );
};

export default Filter;
