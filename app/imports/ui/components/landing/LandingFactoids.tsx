import React, { useState, useEffect } from 'react';
import { Header } from 'semantic-ui-react';
import CareerGoalFactoid from './factoids/CareerGoalFactoid';
import IceFactoid from './factoids/IceFactoid';
import InterestFactoid from './factoids/InterestFactoid';

const LandingFactoids: React.FC = () => {
  const factoidInfo = [
    <InterestFactoid name="C++" numberOfStudents={24} numberOfOpportunities={12} numberOfCourses={2}
                     description="The C+ language is most commonly used for systems programming..." />,
    <CareerGoalFactoid name="Game Developer" numberOfStudents={138} numberOfOpportunities={5} numberOfCourses={1} description="A Game Developer is a specialized Software Developer who focuses on game design and implementation...." />,
    <IceFactoid />,
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
