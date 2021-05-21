import React from 'react';
import Markdown from 'react-markdown';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

export interface Task3SegmentProps {
  goal: string,
  info: string,
  count: number,
}
const Task3Component: React.FC<Task3SegmentProps> = ({ goal, info, count }) => {
  const Task3Header = <RadGradHeader title="TASK 3: A RANDOM CAREER GOAL(REFRESH FOR A NEW ONE)" icon = "database"/>;
  return (
      <RadGradSegment header={Task3Header}>
          <h2 className ="ui header">{`${goal}`}</h2>
          <Markdown source ={`${info}`}/>
          <hr/>
          <p>Note: the total number of career goal is: {`${count}`}</p>
      </RadGradSegment>
  );
};
export default Task3Component;
