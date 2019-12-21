import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import * as _ from 'lodash';
import { withRouter } from 'react-router-dom';
import * as PlanChoiceUtils from '../../../api/degree-plan/PlanChoiceUtilities';
import { isPlanChoiceSatisfied } from '../../../api/degree-plan/AcademicPlanUtilities';
import * as Router from './RouterHelperFunctions';
import LandingPlanChoicePill from '../landing/LandingPlanChoicePill';
import SatisfiedPlanChoicePill from './SatisfiedPlanChoicePill';
import StaticPlanChoicePill from './StaticPlanChoicePill';
import { IRadGradMatch } from '../../../typings/radgrad';

interface IAcademicPlanTermViewProps {
  title: string;
  id: string;
  choices: string[];
  studentID: string;
  takenSlugs: string[];
  match: IRadGradMatch;
}


const AcademicPlanStaticTermView = (props: IAcademicPlanTermViewProps) => {
  const isStudent = Router.isUrlRoleStudent(props.match);
  const noPaddingStyle = {
    padding: 2,
    margin: 2,
  };

  return (
    <Segment style={noPaddingStyle}>
      <Header dividing={true}>{props.title}</Header>
      {
        isStudent ?
          _.map(props.choices, (choice, index) => {
            const satisfied = isPlanChoiceSatisfied(choice, props.takenSlugs);
            if (PlanChoiceUtils.isSingleChoice(choice) && !PlanChoiceUtils.isXXChoice(choice)) {
              return (
                <StaticPlanChoicePill key={index} choice={choice} satisfied={satisfied}/>
              );
            }
            return (
              <SatisfiedPlanChoicePill key={index} choice={choice} satisfied={satisfied}/>
            );
          })
          :
          _.map(props.choices, (choice, index) => (<LandingPlanChoicePill key={index} choice={choice}/>))
      }
    </Segment>
  );
};

export default withRouter(AcademicPlanStaticTermView);
