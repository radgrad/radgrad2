import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import LandingPlanChoicePill from './LandingPlanChoicePill';

interface ILandingAcademicTempViewProps {
  title: string;
  id: string;
  choices: string[];
}

const LandingAcademicTermView = (props: ILandingAcademicTempViewProps) => {
  const noPaddingStyle = {
    padding: 2,
    margin: 2,
  };
  return (
    <Segment style={noPaddingStyle}>
      <Header dividing={true}>{props.title}</Header>
      <div>
        {_.map(props.choices, (choice, index) => {
          return (
            <LandingPlanChoicePill key={index} choice={choice} index={index}/>
          );
        })}
      </div>
    </Segment>
  );
};

export default LandingAcademicTermView;
