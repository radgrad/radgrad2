import React from 'react';
import { connect } from 'react-redux';
import { AutoForm } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { cardExplorerActions } from '../../../../../redux/shared/cardExplorer';
import { RootState } from '../../../../../redux/types';
import RadioField from '../../../form-fields/RadioField';
import { EXPLORER_TYPE, EXPLORER_SORT_KEYS } from '../../../../utilities/ExplorerUtils';

interface SortProps {
  sortChoice: string;
  setSortValue: (explorerType: string, value: string) => never;
  explorerType: string;
}

const mapStateToProps = (state: RootState, ownProps) => ({
  sortChoice: state.shared.cardExplorer[ownProps.explorerType.replaceAll('-', '').toLowerCase()].sortValue,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setSortValue: (explorerType: string, value: string) => dispatch(cardExplorerActions.setSortValue(ownProps.explorerType, value)),
});

const Sort: React.FC<SortProps> = ({ sortChoice, setSortValue, explorerType }) => {
  const handleChange = (type, value) => {
    setSortValue(explorerType, value);
  };

  const explorerSortValues = (type) => {
    let allowedSortValues:string[];
    switch (type){
      case EXPLORER_TYPE.CAREERGOALS:
        allowedSortValues = [EXPLORER_SORT_KEYS.RECOMMENDED, EXPLORER_SORT_KEYS.MOST_RECENT, EXPLORER_SORT_KEYS.ALPHABETIC];
        break;
      case EXPLORER_TYPE.INTERESTS:
        allowedSortValues = [EXPLORER_SORT_KEYS.MOST_RECENT, EXPLORER_SORT_KEYS.ALPHABETIC];
        break;
      case EXPLORER_TYPE.OPPORTUNITIES:
        allowedSortValues = [EXPLORER_SORT_KEYS.RECOMMENDED, EXPLORER_SORT_KEYS.ALPHABETIC, EXPLORER_SORT_KEYS.EXPERIENCE, EXPLORER_SORT_KEYS.INNOVATION];
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
            <RadioField name="sortBy" label="Sort By:" inline />
        </AutoForm>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Sort);