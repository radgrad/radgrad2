import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import { useRouteMatch } from 'react-router-dom';
import * as PlanChoiceUtils from '../../../../api/degree-plan/PlanChoiceUtilities';
import { isPlanChoiceSatisfied } from '../../../../api/degree-plan/AcademicPlanUtilities';
import * as Router from '../utilities/router';
import LandingPlanChoicePill from '../../landing/LandingPlanChoicePill';
import SatisfiedPlanChoicePill from '../academic-plan/SatisfiedPlanChoicePill';
import StaticPlanChoicePill from '../academic-plan/StaticPlanChoicePill';

interface IAcademicPlanTermViewProps {
  title: string;
  choices: string[];
  takenSlugs: string[];
}

const AcademicPlanStaticTermView = (props: IAcademicPlanTermViewProps) => {
  const match = useRouteMatch();
  const isStudent = Router.isUrlRoleStudent(match);
  const noPaddingStyle = {
    padding: 2,
    margin: 2,
  };

  return (
    <Segment style={noPaddingStyle}>
      <Header dividing>{props.title}</Header>
      {
        isStudent ?
          _.map(props.choices, (choice, index) => {
            const satisfied = isPlanChoiceSatisfied(choice, props.takenSlugs);
            if (PlanChoiceUtils.isSingleChoice(choice) && !PlanChoiceUtils.isXXChoice(choice)) {
              return (
                <StaticPlanChoicePill key={index} choice={choice} satisfied={satisfied} />
              );
            }
            return (
              <SatisfiedPlanChoicePill key={index} choice={choice} satisfied={satisfied} />
            );
          })
          :
          _.map(props.choices, (choice, index) => (<LandingPlanChoicePill key={index} choice={choice} />))
      }
    </Segment>
  );
};

export default AcademicPlanStaticTermView;
