import React from 'react';
import { Header } from 'semantic-ui-react';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { IAcademicPlan } from '../../../../typings/radgrad';
import { getPlanChoices } from '../../../../api/degree-plan/AcademicPlanUtilities';
import AcademicPlanTermView from './AcademicPlanTermView';
import { Users } from '../../../../api/user/UserCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

interface IAcademicPlanYearViewProps {
  yearNumber: number;
  academicPlan: IAcademicPlan;
  username: string;
  takenSlugs: string[];
}

const AcademicPlanYearView: React.FC<IAcademicPlanYearViewProps> = ({ yearNumber, academicPlan, username, takenSlugs }) => {
  const quarter = RadGradProperties.getQuarterSystem();
  let termNum = quarter ? yearNumber * 4 : yearNumber * 3;
  const studentID = Users.getID(username);
  return (
    <div>
      <Header>
        Year {yearNumber + 1}
      </Header>
      <AcademicPlanTermView
        title={AcademicTerms.FALL}
        id={`${AcademicTerms.FALL}-${yearNumber * 10 + termNum}`}
        choices={getPlanChoices(academicPlan, termNum++)}
        studentID={studentID}
        takenSlugs={takenSlugs}
      />
      {quarter ?
        (
          <AcademicPlanTermView
            title={AcademicTerms.WINTER}
            id={`${AcademicTerms.WINTER}-${yearNumber * 10 + termNum}`}
            choices={getPlanChoices(academicPlan, termNum++)}
            studentID={studentID}
            takenSlugs={takenSlugs}
          />
        )
        : ''}
      <AcademicPlanTermView
        title={AcademicTerms.SPRING}
        id={`${AcademicTerms.SPRING}-${yearNumber * 10 + termNum}`}
        choices={getPlanChoices(academicPlan, termNum++)}
        studentID={studentID}
        takenSlugs={takenSlugs}
      />
      <AcademicPlanTermView
        title={AcademicTerms.SUMMER}
        id={`${AcademicTerms.SUMMER}-${yearNumber * 10 + termNum}`}
        choices={getPlanChoices(academicPlan, termNum++)}
        studentID={studentID}
        takenSlugs={takenSlugs}
      />
    </div>
  );
};

export default AcademicPlanYearView;
