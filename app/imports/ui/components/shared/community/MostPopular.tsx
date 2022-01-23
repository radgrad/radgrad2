import React from 'react';
import { Users } from '../../../../api/user/UserCollection';
import CareerGoalLabel from '../label/CareerGoalLabel';
import InterestLabel from '../label/InterestLabel';
import OpportunityLabel from '../label/OpportunityLabel';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';

export const enum MOSTPOPULAR {
  INTEREST = 'INTEREST',
  CAREERGOAL = 'CAREERGOAL',
  OPPORTUNITY = 'OPPORTUNITY',
  INTERNSHIP = 'INTERNSHIP',
}

interface MostPopularProps {
  type: MOSTPOPULAR;
  data: Array<[string, number]>;
}

const MostPopular: React.FC<MostPopularProps> = ({ type, data }) => {
  let icon;
  let title;
  let labels;
  const userID = Users.getID(Meteor.user().username);
  if (type === MOSTPOPULAR.CAREERGOAL) {
    icon = 'briefcase';
    title = 'Popular Careers';
    labels = data && data.map(pair => <div key={pair[0]}><CareerGoalLabel userID={userID} slug={pair[0]} rightside={` (${pair[1]})`}/></div>);
  } else if (type === MOSTPOPULAR.INTEREST) {
    icon = 'heart outline';
    title = 'Popular Interests';
    labels = data && data.map(pair => <div key={pair[0]}><InterestLabel userID={userID} slug={pair[0]} rightside={` (${pair[1]})`}/></div>);
  } else if (type === MOSTPOPULAR.OPPORTUNITY) {
    icon = 'lightbulb outline';
    title = 'Popular Opportunities';
    labels = data && data.map(pair => <div key={pair[0]}><OpportunityLabel userID={userID} slug={pair[0]} rightside={` (${pair[1]})`}/></div>);
  } else if (type === MOSTPOPULAR.INTERNSHIP) {
    icon = 'heart outline';
    title = 'Interest (Internships)';
    labels = data && data.map(pair => <div key={pair[0]}><InterestLabel userID={userID} slug={pair[0]} rightside={` (${pair[1]})`}/></div>);
  }
  const header = <RadGradHeader title={title} icon={icon} />;
  return (
    <RadGradSegment header={header}>
      {labels}
    </RadGradSegment>
  );
};

export default MostPopular;
