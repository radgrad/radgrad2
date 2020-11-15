import React from 'react';
import { AutoForm } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import RadioField from '../../../form-fields/RadioField';

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
  const formSchema = new SimpleSchema2Bridge(schema);
  const model = {
    filterCoursesBy: props.filterChoice,
  };
  return (
    <div>
      <AutoForm schema={formSchema} model={model} onChange={props.handleChange}>
        <RadioField name="filterCoursesBy" label="Filter Courses By:" inline />
      </AutoForm>
    </div>
  );
};

export default CourseFilterWidget;
