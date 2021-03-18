import React, { useState, useEffect } from 'react';
import {
  InterestOrCareerGoalFactoidProps,
  LevelFactoidProps,
  OpportunityFactoidProps,
  ReviewFactoidProps,
} from '../../../typings/radgrad';
import CareerGoalFactoid from './factoids/CareerGoalFactoid';
import IceFactoid from './factoids/IceFactoid';
import InterestFactoid from './factoids/InterestFactoid';
import LevelFactoid from './factoids/LevelFactoid';
import ReviewFactoid from './factoids/ReviewFactoid';
import OpportunityFactoid from './factoids/OpportunityFactoid';

interface LandingFactoidsProps {
  careerGoalFactoid: InterestOrCareerGoalFactoidProps,
  interestFactoid: InterestOrCareerGoalFactoidProps,
  levelFactoid: LevelFactoidProps,
  opportunityFactoid: OpportunityFactoidProps,
  reviewFactoid: ReviewFactoidProps,
}

const LandingFactoids: React.FC<LandingFactoidsProps> = ({ careerGoalFactoid, interestFactoid, levelFactoid, opportunityFactoid, reviewFactoid }) => {
  const factoidInfo = [
    <CareerGoalFactoid {...careerGoalFactoid} />,
    <InterestFactoid {...interestFactoid} />,
    <IceFactoid />,
    <LevelFactoid {...levelFactoid} />,
    <OpportunityFactoid {...opportunityFactoid} />,
    <ReviewFactoid {...reviewFactoid} />,
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timerID = setInterval(() => tick(), 5000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  const tick = () => {
    setIndex((index + 1) % factoidInfo.length);
  };
  const landingStyle = {
    height: 200,
  };
  return (
    <div id="landing-factoids" style={landingStyle}>
      {factoidInfo[index]}
    </div>
  );
};
export default LandingFactoids;
