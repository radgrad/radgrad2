import * as React from 'react';
import { Header } from 'semantic-ui-react';
import { IAcademicPlan } from '../../../typings/radgrad';
import { getPlanChoices } from '../../../api/degree-plan/AcademicPlanUtilities';
import AcademicPlanTermView from './AcademicPlanTermView';

interface IAcademicPlanYearViewProps {
  yearNumber: number;
  academicPlan: IAcademicPlan;
}

const AcademicPlanYearView = (props: IAcademicPlanYearViewProps) => {
  const quarter = props.academicPlan.coursesPerAcademicTerm.length % 4 === 0;
  let termNum = quarter ? props.yearNumber * 4 : props.yearNumber * 3;
  return (
    <div>
      <Header>Year {props.yearNumber}</Header>
      <AcademicPlanTermView title="Fall" id={`Fall-${props.yearNumber * 10 + termNum}`}
                            choices={getPlanChoices(props.academicPlan, termNum++)}/>
      {quarter ? (<AcademicPlanTermView title="Winter" id={`Winter-${props.yearNumber * 10 + termNum}`}
                                        choices={getPlanChoices(props.academicPlan, termNum++)}/>) : ''}
      <AcademicPlanTermView title="Spring" id={`Spring-${props.yearNumber * 10 + termNum}`}
                            choices={getPlanChoices(props.academicPlan, termNum++)}/>
      <AcademicPlanTermView title="Summer" id={`Summer-${props.yearNumber * 10 + termNum}`}
                            choices={getPlanChoices(props.academicPlan, termNum++)}/>

    </div>
  );
};

export default AcademicPlanYearView;
