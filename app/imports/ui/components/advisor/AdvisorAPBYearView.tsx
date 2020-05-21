import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';
import AdvisorAPBTermView from './AdvisorAPBTermView';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';

interface IAdvisorAPBYearViewProps {
  yearNumber: number;
  coursesPerTerm: number[];
  choiceList: string[];
  quarterSystem: boolean;
}

const AdvisorAPBYearView = (props: IAdvisorAPBYearViewProps) => {
  const academicYearStyle = {
    padding: '0 0.6rem',
  };
  // console.log(props);
  const numTermsPerYear = props.quarterSystem ? 4 : 3;
  let termNum = (props.yearNumber - 1) * numTermsPerYear;
  // console.log('YearView props %o termNum=%o', props, termNum);
  return (
    <Grid.Column key={props.yearNumber} style={academicYearStyle}>
      <Divider horizontal>
        Year
        {props.yearNumber}
      </Divider>
      {props.quarterSystem ? (
        <div>
          <AdvisorAPBTermView
            termName={AcademicTerms.FALL}
            termNumber={termNum++}
            yearNumber={props.yearNumber}
            choiceList={props.choiceList}
            coursesPerTerm={props.coursesPerTerm}
          />
          <AdvisorAPBTermView
            termName={AcademicTerms.WINTER}
            termNumber={termNum++}
            yearNumber={props.yearNumber}
            choiceList={props.choiceList}
            coursesPerTerm={props.coursesPerTerm}
          />
          <AdvisorAPBTermView
            termName={AcademicTerms.SPRING}
            termNumber={termNum++}
            yearNumber={props.yearNumber}
            choiceList={props.choiceList}
            coursesPerTerm={props.coursesPerTerm}
          />
          <AdvisorAPBTermView
            termName={AcademicTerms.SUMMER}
            termNumber={termNum++}
            yearNumber={props.yearNumber}
            choiceList={props.choiceList}
            coursesPerTerm={props.coursesPerTerm}
          />
        </div>
      ) : (
        <div>
          <AdvisorAPBTermView
            termName={AcademicTerms.FALL}
            termNumber={termNum++}
            yearNumber={props.yearNumber}
            choiceList={props.choiceList}
            coursesPerTerm={props.coursesPerTerm}
          />
          <AdvisorAPBTermView
            termName={AcademicTerms.SPRING}
            termNumber={termNum++}
            yearNumber={props.yearNumber}
            choiceList={props.choiceList}
            coursesPerTerm={props.coursesPerTerm}
          />
          <AdvisorAPBTermView
            termName={AcademicTerms.SUMMER}
            termNumber={termNum++}
            yearNumber={props.yearNumber}
            choiceList={props.choiceList}
            coursesPerTerm={props.coursesPerTerm}
          />
        </div>
      )}
    </Grid.Column>
  );
};

export default AdvisorAPBYearView;
