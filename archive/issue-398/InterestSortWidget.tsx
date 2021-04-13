import React from 'react';
import { connect } from 'react-redux';
import { AutoForm } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { cardExplorerActions } from '../../app/imports/redux/shared/cardExplorer';
import { RootState } from '../../app/imports/redux/types';
import RadioField from '../../app/imports/ui/components/form-fields/RadioField';
import { EXPLORER_TYPE } from '../../app/imports/ui/layouts/utilities/route-constants';

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
            <RadioField name="sortInterestsBy" label="Sort By:" inline />
        </AutoForm>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(InterestSortWidget);
