import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import LandingPlanChoicePill from '../LandingPlanChoicePill';

interface LandingAcademicTempViewProps {
  title: string;
  choices: string[];
}

const LandingAcademicTermView: React.FC<LandingAcademicTempViewProps> = ({ title, choices }) => {
  const noPaddingStyle = {
    padding: 2,
    margin: 2,
  };
  return (
    <Segment style={noPaddingStyle}>
      <Header dividing>{title}</Header>
      <div>
        {_.map(choices, (choice, index) => (
          <LandingPlanChoicePill key={index} choice={choice} />
        ))}
      </div>
    </Segment>
  );
};

export default LandingAcademicTermView;
