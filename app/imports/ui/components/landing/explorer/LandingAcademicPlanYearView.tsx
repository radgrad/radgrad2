import React from 'react';
import { Header } from 'semantic-ui-react';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { IAcademicPlan } from '../../../../typings/radgrad';
import { getPlanChoices } from '../../../../api/degree-plan/AcademicPlanUtilities';
import LandingAcademicTermView from './LandingAcademicTermView';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

interface ILandingAcademicPlanYearViewProps {
  yearNumber: number;
  academicPlan: IAcademicPlan;
}

const LandingAcademicPlanYearView: React.FC<ILandingAcademicPlanYearViewProps> = ({ yearNumber, academicPlan }) => {
  const quarter = RadGradProperties.getQuarterSystem();
  let termNum = quarter ? yearNumber * 4 : yearNumber * 3;
  // console.log('LandingAcademicPlanYearView props=%o quarter=%o', props, quarter);
  return (
    <div>
      <Header>
        Year {yearNumber + 1}
      </Header>
      <LandingAcademicTermView
        title={AcademicTerms.FALL}
        id={`${AcademicTerms.FALL}-${yearNumber * 10 + termNum}`}
        choices={getPlanChoices(academicPlan, termNum++)}
      />
      {quarter ?
        (
          <LandingAcademicTermView
            title={AcademicTerms.WINTER}
            id={`${AcademicTerms.WINTER}-${yearNumber * 10 + termNum}`}
            choices={getPlanChoices(academicPlan, termNum++)}
          />
        )
        : ''}
      <LandingAcademicTermView
        title={AcademicTerms.SPRING}
        id={`${AcademicTerms.SPRING}-${yearNumber * 10 + termNum}`}
        choices={getPlanChoices(academicPlan, termNum++)}
      />
      <LandingAcademicTermView
        title={AcademicTerms.SUMMER}
        id={`${AcademicTerms.SUMMER}-${yearNumber * 10 + termNum}`}
        choices={getPlanChoices(academicPlan, termNum++)}
      />
    </div>
  );
};

export default LandingAcademicPlanYearView;
