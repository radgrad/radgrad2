import React from 'react';
import { AutoForm, ErrorsField } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useStickyState } from '../../../../utilities/StickyState';
import RadioField from '../../../form-fields/RadioField';
import { EXPLORER_TYPE, EXPLORER_SORT_KEYS } from '../../../../utilities/ExplorerUtils';

interface SortProps {
  explorerType: string;
}

const Sort: React.FC<SortProps> = ({ explorerType }) => {
  const [sortChoice, setSortChoice] = useStickyState(`Sort.${explorerType}`,
    (explorerType === EXPLORER_TYPE.COURSES) ? EXPLORER_SORT_KEYS.NUMBER : EXPLORER_SORT_KEYS.ALPHABETIC);
  const handleChange = (type, value) => {
    setSortChoice(value);
  };

  const explorerSortValues = (type) => {
    let allowedSortValues: string[];
    switch (type) {
      case EXPLORER_TYPE.CAREERGOALS:
        allowedSortValues = [EXPLORER_SORT_KEYS.ALPHABETIC, EXPLORER_SORT_KEYS.RECOMMENDED, EXPLORER_SORT_KEYS.MOST_RECENT];
        break;
      case EXPLORER_TYPE.INTERESTS:
        allowedSortValues = [EXPLORER_SORT_KEYS.ALPHABETIC, EXPLORER_SORT_KEYS.MOST_RECENT];
        break;
      case EXPLORER_TYPE.COURSES:
        allowedSortValues = [EXPLORER_SORT_KEYS.NUMBER, EXPLORER_SORT_KEYS.ALPHABETIC, EXPLORER_SORT_KEYS.RECOMMENDED];
        break;
      case EXPLORER_TYPE.OPPORTUNITIES:
        allowedSortValues = [EXPLORER_SORT_KEYS.ALPHABETIC, EXPLORER_SORT_KEYS.RECOMMENDED, EXPLORER_SORT_KEYS.MOST_RECENT, EXPLORER_SORT_KEYS.EXPERIENCE, EXPLORER_SORT_KEYS.INNOVATION];
        break;
    }
    return allowedSortValues;
  };

  const schema = new SimpleSchema({
    sortBy: {
      type: String,
      allowedValues: explorerSortValues(explorerType),
      optional: true,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const model = {
    sortBy: sortChoice,
  };
  return (
    <AutoForm schema={formSchema} model={model} onChange={handleChange}>
      <RadioField name="sortBy" label="Sort By:" inline/>
      <ErrorsField/>
    </AutoForm>
  );
};

export default Sort;
