import React from 'react';
import { AutoForm } from 'uniforms-semantic/';
import SimpleSchema from 'simpl-schema';
import RadioField from '../form-fields/RadioField';

export const courseFilterKeys = {
  none: 'All',
  threeHundredPLus: '300+',
  fourHundredPlus: '400+',
  sixHundredPlus: '600+',
};

interface ICourseFilterWidgetProps {
  filterChoice: string;
  handleChange: (key: string, value: string) => any;
}

const CourseFilterWidget = (props: ICourseFilterWidgetProps) => {
  const schema = new SimpleSchema({
    filterCoursesBy: {
      type: String,
      allowedValues: [
        courseFilterKeys.none,
        courseFilterKeys.threeHundredPLus,
        courseFilterKeys.fourHundredPlus,
        courseFilterKeys.sixHundredPlus,
      ],
      optional: true,
    },
  });
  const model = {
    filterCoursesBy: props.filterChoice,
  };
  return (
    <div>
      <AutoForm schema={schema} model={model} onChange={props.handleChange}>
        <RadioField name="filterCoursesBy" inline />
      </AutoForm>
    </div>
  );
};

export default CourseFilterWidget;
