import React from 'react';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';

interface OnBoardVar {
  totalCareerGoals: [];
  randomName: string;
  randomDescription: string;
}

const Task3: React.FC<OnBoardVar> = ({ randomName, randomDescription, totalCareerGoals }) => {
  const CareerGoalLength = totalCareerGoals.length;
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
  const random = _.sample(totalCareerGoals);
  const randomName  = random.name;
  const randomDescription = random.description;
  return {
    totalCareerGoals,
    randomName,
    randomDescription,
  };
})(Task3);
