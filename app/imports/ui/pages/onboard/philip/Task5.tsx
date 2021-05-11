import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Interest } from '../../../../typings/radgrad';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

interface Task5Props {
  interests: Interest[];
}

const Task5: React.FC<Task5Props> = ({ interests }) => {
  const header = <RadGradHeader title="Task 5: A simple form" icon='file alternate outline' />;

  return (
    <RadGradSegment header={header}>
   next one.
    </RadGradSegment>
  );
};

const Task5Container = withTracker(() => {
  const interests = Interests.findNonRetired();
  return { interests };
})(Task5);

export default Task5Container;
