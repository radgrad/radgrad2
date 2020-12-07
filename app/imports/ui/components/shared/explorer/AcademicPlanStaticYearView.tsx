import React from 'react';
import { Header } from 'semantic-ui-react';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { IAcademicPlan } from '../../../../typings/radgrad';
import { getPlanChoices } from '../../../../api/degree-plan/AcademicPlanUtilities';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import AcademicPlanStaticTermView from './AcademicPlanStaticTermView';

interface IAcademicPlanYearViewProps {
  yearNumber: number;
  academicPlan: IAcademicPlan;
  username: string;
  takenSlugs: string[];
}

const AcademicPlanStaticYearView: React.FC<IAcademicPlanYearViewProps> = ({ yearNumber, academicPlan, username, takenSlugs }) => {
  const quarter = RadGradProperties.getQuarterSystem();
  let termNum = quarter ? yearNumber * 4 : yearNumber * 3;
  return (
    <div>
      <Header>
        Year {yearNumber + 1}
      </Header>
      <AcademicPlanStaticTermView
        title={AcademicTerms.FALL}
        choices={getPlanChoices(academicPlan, termNum++)}
        takenSlugs={takenSlugs}
      />
      {quarter ? (
        <AcademicPlanStaticTermView
          title={AcademicTerms.WINTER}
          choices={getPlanChoices(academicPlan, termNum++)}
          takenSlugs={takenSlugs}
        />
      ) : ''}
      <AcademicPlanStaticTermView
        title={AcademicTerms.SPRING}
        choices={getPlanChoices(academicPlan, termNum++)}
        takenSlugs={takenSlugs}
      />
      <AcademicPlanStaticTermView
        title={AcademicTerms.SUMMER}
        choices={getPlanChoices(academicPlan, termNum++)}
        takenSlugs={takenSlugs}
      />
    </div>
  );
};

export default AcademicPlanStaticYearView;
