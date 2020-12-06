import React from 'react';
import { Divider, Grid } from 'semantic-ui-react';
import AdvisorAPBTermView from './AdvisorAPBTermView';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

interface IAdvisorAPBYearViewProps {
  yearNumber: number;
  coursesPerTerm: number[];
  choiceList: string[];
  quarterSystem: boolean;
}

const AdvisorAPBYearView: React.FC<IAdvisorAPBYearViewProps> = ({ yearNumber, coursesPerTerm, choiceList, quarterSystem }) => {
  const academicYearStyle = {
    padding: '0 0.6rem',
  };
  // console.log(props);
  const numTermsPerYear = quarterSystem ? 4 : 3;
  let termNum = (yearNumber - 1) * numTermsPerYear;
  // console.log('YearView props %o termNum=%o', props, termNum);
  return (
    <Grid.Column key={yearNumber} style={academicYearStyle}>
      <Divider horizontal>
        Year
        {yearNumber}
      </Divider>
      {quarterSystem ? (
        <div>
          <AdvisorAPBTermView
            termName={AcademicTerms.FALL}
            termNumber={termNum++}
            yearNumber={yearNumber}
            choiceList={choiceList}
            coursesPerTerm={coursesPerTerm}
          />
          <AdvisorAPBTermView
            termName={AcademicTerms.WINTER}
            termNumber={termNum++}
            yearNumber={yearNumber}
            choiceList={choiceList}
            coursesPerTerm={coursesPerTerm}
          />
          <AdvisorAPBTermView
            termName={AcademicTerms.SPRING}
            termNumber={termNum++}
            yearNumber={yearNumber}
            choiceList={choiceList}
            coursesPerTerm={coursesPerTerm}
          />
          <AdvisorAPBTermView
            termName={AcademicTerms.SUMMER}
            termNumber={termNum++}
            yearNumber={yearNumber}
            choiceList={choiceList}
            coursesPerTerm={coursesPerTerm}
          />
        </div>
      ) : (
        <div>
          <AdvisorAPBTermView
            termName={AcademicTerms.FALL}
            termNumber={termNum++}
            yearNumber={yearNumber}
            choiceList={choiceList}
            coursesPerTerm={coursesPerTerm}
          />
          <AdvisorAPBTermView
            termName={AcademicTerms.SPRING}
            termNumber={termNum++}
            yearNumber={yearNumber}
            choiceList={choiceList}
            coursesPerTerm={coursesPerTerm}
          />
          <AdvisorAPBTermView
            termName={AcademicTerms.SUMMER}
            termNumber={termNum++}
            yearNumber={yearNumber}
            choiceList={choiceList}
            coursesPerTerm={coursesPerTerm}
          />
        </div>
      )}
    </Grid.Column>
  );
};

export default AdvisorAPBYearView;
