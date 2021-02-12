import React, { useState, useEffect } from 'react';
import CareerGoalFactoid from './factoids/CareerGoalFactoid';
import IceFactoid from './factoids/IceFactoid';
import InterestFactoid from './factoids/InterestFactoid';
import LevelFactoid from './factoids/LevelFactoid';
import ReviewFactoid from './factoids/ReviewFactoid';
import OpportunityFactiod from './factoids/OpportunityFactoid';

const LandingFactoids: React.FC = () => {
  const factoidInfo = [
    <InterestFactoid name="C++" numberOfStudents={24} numberOfOpportunities={12} numberOfCourses={2}
                     description="The C+ language is most commonly used for systems programming..." />,
    <CareerGoalFactoid name="Game Developer" numberOfStudents={138} numberOfOpportunities={5} numberOfCourses={1} description="A Game Developer is a specialized Software Developer who focuses on game design and implementation...." />,
    <IceFactoid />,
    <LevelFactoid level={3} numberOfStudents={59} description="Level 3 students have completed at least three courses." />,
    <ReviewFactoid name="Review of ICS 314" description="ICS 314 teaches valuable concepts if you want to be a Software Engineer." />,
    <OpportunityFactiod picture="/images/landing/acm.png" name="ACM Manoa" ice={{ i: 5, c: 0, e: 5 }} description="The Association for Computing Machinery at Manoa is UH Manoa’s student chapter of the Association for Computing Machinery." numberOfStudents={142} />,
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timerID = setInterval(() => tick(), 5000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setIndex((index + 1) % factoidInfo.length);
  }

  return (
    <div id="landing-factoids">
      {factoidInfo[index]}
    </div>
  );
};
export default LandingFactoids;
