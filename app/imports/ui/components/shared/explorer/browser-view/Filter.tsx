import React from 'react';
import { connect } from 'react-redux';
import { AutoForm } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import RadioField from '../../../form-fields/RadioField';
import { RootState } from '../../../../../redux/types';
import { cardExplorerActions } from '../../../../../redux/shared/cardExplorer';
import { EXPLORER_TYPE, EXPLORER_FILTER_KEYS } from '../../../../utilities/ExplorerUtils';

interface FilterProps {
  filterChoice: string;
  setFilterChoice: (key: string, value: string) => never;
  explorerType: string;
}

const mapStateToProps = (state: RootState, ownProps) => ({
  filterChoice: state.shared.cardExplorer[ownProps.explorerType.replaceAll('-', '').toLowerCase().concat('Filter')].filterValue,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setFilterChoice: (explorerType: string, value: string) => dispatch(cardExplorerActions.setFilterValue(ownProps.explorerType, value)),
});

const Filter: React.FC<FilterProps> = ({ filterChoice, setFilterChoice, explorerType }) => {
  const handleChange = (type, value) => {
    setFilterChoice(explorerType, value);
  };

  const explorerFilterValues = (type) => {
    let allowedFilterValues:string[];
    switch (type){
      case EXPLORER_TYPE.CAREERGOALS:
      case EXPLORER_TYPE.OPPORTUNITIES:
      case EXPLORER_TYPE.INTERESTS:
        allowedFilterValues = [EXPLORER_FILTER_KEYS.NONE, EXPLORER_FILTER_KEYS.INPROFILE, EXPLORER_FILTER_KEYS.NOTINPROFILE];
        break;
      case EXPLORER_TYPE.COURSES:
        allowedFilterValues = [EXPLORER_FILTER_KEYS.NONE, EXPLORER_FILTER_KEYS.THREEHUNDREDPLUS, EXPLORER_FILTER_KEYS.FOURHUNDREDPLUS, EXPLORER_FILTER_KEYS.SIXHUNDREDPLUS];
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
  const model = {
    filterBy: filterChoice,
  };
  return (
        <div>
            <AutoForm schema={formSchema} model={model} onChange={handleChange}>
                <RadioField name="filterBy" label="Filter By:" inline />
            </AutoForm>
        </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
