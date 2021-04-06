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

export const opportunitySortKeys = {
  recommended: 'Recommended',
  alphabetic: 'Alphabetic',
  innovation: 'Innovation',
  experience: 'Experience',
};

interface SortWidgetProps {
  sortChoice: string;
  setSortValue: (explorerType: string, value: string) => any;
  explorerType: string;
}

const mapStateToProps = (state: RootState, ownProps) => {
  if (ownProps.explorerType === EXPLORER_TYPE.INTERESTS) {
    return { sortChoice: state.shared.cardExplorer.interests.sortValue };
  } if (ownProps.explorerType === EXPLORER_TYPE.CAREERGOALS) {
    return { sortChoice: state.shared.cardExplorer.careergoals.sortValue };
  }
  return null;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  switch (ownProps.explorerType) {
    case EXPLORER_TYPE.CAREERGOALS:
      return {
        setSortValue: (explorerType: string, value: string) => dispatch(cardExplorerActions.setCareerGoalsSortValue(explorerType, value)),
      };
    case EXPLORER_TYPE.INTERESTS: {
      return {
        setSortValue: (explorerType: string, value: string) => dispatch(cardExplorerActions.setInterestsSortValue(explorerType, value)),
      };
    }
    default:
      return null;
  }
};

const SortWidget: React.FC<SortWidgetProps> = ({ sortChoice, setSortValue, explorerType }) => {
  const handleChange = (type, value) => {
    setSortValue(explorerType, value);
  };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const explorerSortValues = (type) => {
    let allowedSortValues:string[];
    switch (type){
      case EXPLORER_TYPE.CAREERGOALS:
      case EXPLORER_TYPE.INTERESTS:
        allowedSortValues = [interestSortKeys.mostRecent, interestSortKeys.alphabetic];
        break;
      case EXPLORER_TYPE.OPPORTUNITIES:
        allowedSortValues = [opportunitySortKeys.recommended, opportunitySortKeys.alphabetic, opportunitySortKeys.experience, opportunitySortKeys.innovation];
        break;
    }
    return allowedSortValues;
  };
  const schema = new SimpleSchema({
    sortBy: {
      type: String,
      allowedValues: [interestSortKeys.mostRecent, interestSortKeys.alphabetic],
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

export default connect(mapStateToProps, mapDispatchToProps)(SortWidget);
