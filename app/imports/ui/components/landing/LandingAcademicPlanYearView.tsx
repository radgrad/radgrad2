import React from 'react';
import { Header } from 'semantic-ui-react';
import { IAcademicPlan } from '../../../typings/radgrad';
import { getPlanChoices } from '../../../api/degree-plan/AcademicPlanUtilities';
import LandingAcademicTermView from './LandingAcademicTermView';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';

interface ILandingAcademicPlanYearViewProps {
  yearNumber: number;
  academicPlan: IAcademicPlan;
}

const LandingAcademicPlanYearView = (props: ILandingAcademicPlanYearViewProps) => {
  const quarter = RadGradSettings.findOne({}).quarterSystem;
  let termNum = quarter ? props.yearNumber * 4 : props.yearNumber * 3;
  // console.log('LandingAcademicPlanYearView props=%o quarter=%o', props, quarter);
  return (
    <div>
      <Header>
Year
        {props.yearNumber + 1}
      </Header>
      <LandingAcademicTermView
        title={AcademicTerms.FALL}
        id={`${AcademicTerms.FALL}-${props.yearNumber * 10 + termNum}`}
        choices={getPlanChoices(props.academicPlan, termNum++)}
      />
      {quarter ? (
        <LandingAcademicTermView
          title={AcademicTerms.WINTER}
          id={`${AcademicTerms.WINTER}-${props.yearNumber * 10 + termNum}`}
          choices={getPlanChoices(props.academicPlan, termNum++)}
        />
) : ''}
      <LandingAcademicTermView
        title={AcademicTerms.SPRING}
        id={`${AcademicTerms.SPRING}-${props.yearNumber * 10 + termNum}`}
        choices={getPlanChoices(props.academicPlan, termNum++)}
      />
      <LandingAcademicTermView
        title={AcademicTerms.SUMMER}
        id={`${AcademicTerms.SUMMER}-${props.yearNumber * 10 + termNum}`}
        choices={getPlanChoices(props.academicPlan, termNum++)}
      />
    </div>
  );
};

export default LandingAcademicPlanYearView;
