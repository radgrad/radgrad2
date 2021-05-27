import React from 'react';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { CareerGoal } from '../../../../typings/radgrad';

interface Task3Prop {
  totalCareerGoals: [];
  randomCareer: CareerGoal;
}

const Task3: React.FC<Task3Prop> = ({ randomCareer, totalCareerGoals }) => {
  const CareerGoalLength = totalCareerGoals.length;
  const randomName = randomCareer.name;
  const randomDescription = randomCareer.description;
  return (
    <RadGradSegment header={<RadGradHeader title='TASK 3: A RANDOM CAREER GOAL (REFRESH FOR A NEW ONE)' icon='database'/>}>
      <div className='ui vertical segment'>
        <h3 className='ui header' style={{ marginBottom: '1em' }}> {randomName} </h3>
        <Markdown escapeHtml source={randomDescription} />
      </div>
      <div className='ui vertical segment'>
        Note: The total number of career goals is: {CareerGoalLength}
      </div>
    </RadGradSegment>
  );
};

export default withTracker(() => {
  const totalCareerGoals = CareerGoals.findNonRetired();
  const randomCareer = _.sample(totalCareerGoals);
  return {
    totalCareerGoals,
    randomCareer,
  };
})(Task3);
