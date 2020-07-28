import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import LandingPlanChoicePill from './LandingPlanChoicePill';

interface ILandingAcademicTempViewProps {
  title: string;
  choices: string[];
}

const LandingAcademicTermView = (props: ILandingAcademicTempViewProps) => {
  const noPaddingStyle = {
    padding: 2,
    margin: 2,
  };
  return (
    <Segment style={noPaddingStyle}>
      <Header dividing>{props.title}</Header>
      <div>
        {_.map(props.choices, (choice, index) => (
          <LandingPlanChoicePill key={index} choice={choice} />
          ))}
      </div>
    </Segment>
  );
};

export default LandingAcademicTermView;
