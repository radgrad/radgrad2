import React from 'react';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

export interface Task2SegmentProps {
  loggedInUser: string;
  urlUser: string;
}

const Task2Segment: React.FC<Task2SegmentProps> = ({ loggedInUser, urlUser }) => {
  const task2Header = <RadGradHeader title="TASK 2:  WHO IS THE USER?" icon = "user graduate" dividing/>;
  return (
      <RadGradSegment header={task2Header}>
          <p>The currently logged in user is {`${loggedInUser}`}.</p>
          <p>The user in the URL is {`${urlUser}`}.</p>
          <p> In RadGrad, these are not the necessarily the same.</p>
      </RadGradSegment>
  );
};

export default Task2Segment;
