import React from 'react';
import { connect } from 'react-redux';
import { AutoForm } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import RadioField from '../../../form-fields/RadioField';
import { RootState } from '../../../../../redux/types';
import { cardExplorerActions } from '../../../../../redux/shared/cardExplorer';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';

export const courseFilterKeys = {
  none: 'All',
  threeHundredPLus: '300+',
  fourHundredPlus: '400+',
  sixHundredPlus: '600+',
};

interface CourseFilterWidgetProps {
  filterChoice: string;
  setFilterChoice: (key: string, value: string) => any;
}

const mapStateToProps = (state: RootState) => ({
  filterChoice: state.shared.cardExplorer.courses.filterValue,
});

const mapDispatchToProps = (dispatch) => ({
  setFilterChoice: (explorerType: string, value: string) => dispatch(cardExplorerActions.setCoursesFilterValue(explorerType, value)),
});

const CourseFilterWidget: React.FC<CourseFilterWidgetProps> = ({ filterChoice, setFilterChoice }) => {
  const handleChange = (type, value) => {
    setFilterChoice(EXPLORER_TYPE.COURSES, value);
  };

  const schema = new SimpleSchema({
    filterCoursesBy: {
      type: String,
      allowedValues: [courseFilterKeys.none, courseFilterKeys.threeHundredPLus, courseFilterKeys.fourHundredPlus, courseFilterKeys.sixHundredPlus],
      optional: true,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  const model = {
    filterCoursesBy: filterChoice,
  };
  return (
    <div>
      <AutoForm schema={formSchema} model={model} onChange={handleChange}>
        <RadioField name="filterCoursesBy" label="Filter Courses By:" inline />
      </AutoForm>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseFilterWidget);
