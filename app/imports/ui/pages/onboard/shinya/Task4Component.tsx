import React from 'react';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';


export interface Task4Props {
  goal: string,
}
const Task4Component: React.FC<Task4Props> = ({ goal }) => {
  const Task4Header = <RadGradHeader title="Task 4 Labels" icon="tags"/>;
  return (
    <RadGradSegment header={Task4Header}>
        <RadGradHeader title="Career Goals"/>
        <RadGradHeader title="Courses"/>
        <RadGradHeader title="Interests"/>
        <RadGradHeader title="Opportunities"/>
        <RadGradHeader title="Students"/>
    </RadGradSegment>
  );
};
export default Task4Component;
