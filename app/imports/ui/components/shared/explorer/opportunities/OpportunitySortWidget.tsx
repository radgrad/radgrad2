import React from 'react';
import { connect } from 'react-redux';
import { AutoForm } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { cardExplorerActions } from '../../../../../redux/shared/cardExplorer';
import { RootState } from '../../../../../redux/types';
import RadioField from '../../../form-fields/RadioField';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';

export const opportunitySortKeys = {
  recommended: 'Recommended',
  alphabetic: 'Alphabetic',
  innovation: 'Innovation',
  experience: 'Experience',
};

interface OpportunitySortWidgetProps {
  sortChoice: string;
  setOpportunitiesSortValue: (explorerType: string, value: string) => any;
}

const mapStateToProps = (state: RootState) => ({
  sortChoice: state.shared.cardExplorer.opportunities.sortValue,
});

const mapDispatchToProps = (dispatch) => ({
  setOpportunitiesSortValue: (explorerType: string, value: string) => dispatch(cardExplorerActions.setOpportunitiesSortValue(explorerType, value)),
});

const OpportunitySortWidget: React.FC<OpportunitySortWidgetProps> = ({ sortChoice, setOpportunitiesSortValue }) => {

  const handleChange = (type, value) => {
    setOpportunitiesSortValue(EXPLORER_TYPE.OPPORTUNITIES, value);
  };

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
    sortOpportunitiesBy: sortChoice,
  };
  return (
    <AutoForm schema={formSchema} model={model} onChange={handleChange}>
      <RadioField name="sortOpportunitiesBy" label="Sort Opportunities By:" inline />
    </AutoForm>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OpportunitySortWidget);
