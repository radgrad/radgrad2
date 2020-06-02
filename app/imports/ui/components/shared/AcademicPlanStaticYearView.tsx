import React from 'react';
import { Header } from 'semantic-ui-react';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { IAcademicPlan } from '../../../typings/radgrad';
import { getPlanChoices } from '../../../api/degree-plan/AcademicPlanUtilities';
import { Users } from '../../../api/user/UserCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import AcademicPlanStaticTermView from './AcademicPlanStaticTermView';

interface IAcademicPlanYearViewProps {
  yearNumber: number;
  academicPlan: IAcademicPlan;
  username: string;
  takenSlugs: string[];
}

const AcademicPlanStaticYearView = (props: IAcademicPlanYearViewProps) => {
  const quarter = RadGradProperties.getQuarterSystem();
  let termNum = quarter ? props.yearNumber * 4 : props.yearNumber * 3;
  const studentID = Users.getID(props.username);
  return (
    <div>
      <Header>
        Year {props.yearNumber + 1}
      </Header>
      <AcademicPlanStaticTermView
        title={AcademicTerms.FALL}
        id={`${AcademicTerms.FALL}-${props.yearNumber * 10 + termNum}`}
        choices={getPlanChoices(props.academicPlan, termNum++)}
        groups={props.academicPlan.groups}
        studentID={studentID}
        takenSlugs={props.takenSlugs}
      />
      {quarter ? (
        <AcademicPlanStaticTermView
          title={AcademicTerms.WINTER}
          id={`${AcademicTerms.WINTER}-${props.yearNumber * 10 + termNum}`}
          choices={getPlanChoices(props.academicPlan, termNum++)}
          groups={props.academicPlan.groups}
          studentID={studentID}
          takenSlugs={props.takenSlugs}
        />
      ) : ''}
      <AcademicPlanStaticTermView
        title={AcademicTerms.SPRING}
        id={`${AcademicTerms.SPRING}-${props.yearNumber * 10 + termNum}`}
        choices={getPlanChoices(props.academicPlan, termNum++)}
        groups={props.academicPlan.groups}
        studentID={studentID}
        takenSlugs={props.takenSlugs}
      />
      <AcademicPlanStaticTermView
        title={AcademicTerms.SUMMER}
        id={`${AcademicTerms.SUMMER}-${props.yearNumber * 10 + termNum}`}
        choices={getPlanChoices(props.academicPlan, termNum++)}
        groups={props.academicPlan.groups}
        studentID={studentID}
        takenSlugs={props.takenSlugs}
      />
    </div>
  );
};

export default AcademicPlanStaticYearView;
