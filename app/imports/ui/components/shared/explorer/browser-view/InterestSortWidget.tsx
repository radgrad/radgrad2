import React from 'react';
import { connect } from 'react-redux';
import { AutoForm } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { cardExplorerActions } from '../../../../../redux/shared/cardExplorer';
import { RootState } from '../../../../../redux/types';
import RadioField from '../../../form-fields/RadioField';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';

export const interestSortKeys = {
  mostRecent: 'Most Recent',
  alphabetic: 'Alphabetic',
};

interface InterestSortWidgetProps {
  sortChoice: string;
  setInterestsSortValue: (explorerType: string, value: string) => any;
}

const mapStateToProps = (state: RootState) => ({
  sortChoice: state.shared.cardExplorer.interests.sortValue,
});

const mapDispatchToProps = (dispatch) => ({
  setInterestsSortValue: (explorerType: string, value: string) => dispatch(cardExplorerActions.setInterestsSortValue(explorerType, value)),
});

const InterestSortWidget: React.FC<InterestSortWidgetProps> = ({ sortChoice, setInterestsSortValue }) => {
  const handleChange = (type, value) => {
    setInterestsSortValue(EXPLORER_TYPE.INTERESTS, value);
  };

  const schema = new SimpleSchema({
    sortInterestsBy: {
      type: String,
      allowedValues: [interestSortKeys.mostRecent, interestSortKeys.alphabetic],
      optional: true,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const model = {
    sortInterestsBy: sortChoice,
  };
  return (
        <AutoForm schema={formSchema} model={model} onChange={handleChange}>
            <RadioField name="sortInterestsBy" label="Sort By:" inline style={{float:'right'}} />
        </AutoForm>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(InterestSortWidget);
