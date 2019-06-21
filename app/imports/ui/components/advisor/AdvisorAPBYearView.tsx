import * as React from 'react';
import { Divider, Grid } from 'semantic-ui-react';
import { IAdvisorAcademicPlanBuilderWidgetState } from './AdvisorAcademicPlanBuilderWidget'; // eslint-disable-line no-unused-vars
import AdvisorAPBTermView from './AdvisorAPBTermView';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';

interface IAdvisorAPBYearViewProps {
  yearNumber: number;
  coursesPerTerm: number[];
  choiceList: string[];
  quarterSystem: boolean;
}

class AdvisorAPBYearView extends React.Component<IAdvisorAPBYearViewProps, IAdvisorAcademicPlanBuilderWidgetState> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const academicYearStyle = {
      padding: '0 0.6rem',
    };
    // console.log(this.props);
    const numTermsPerYear = this.props.quarterSystem ? 4 : 3;
    let termNum = (this.props.yearNumber - 1) * numTermsPerYear;
    // console.log('YearView props %o termNum=%o', this.props, termNum);
    return (
      <Grid.Column key={this.props.yearNumber} style={academicYearStyle}>
        <Divider horizontal={true}>Year {this.props.yearNumber}</Divider>
        {this.props.quarterSystem ? (
          <div>
            <AdvisorAPBTermView termName={AcademicTerms.FALL} termNumber={termNum++}
                                yearNumber={this.props.yearNumber}
                                choiceList={this.props.choiceList}
                                coursesPerTerm={this.props.coursesPerTerm}/>
            <AdvisorAPBTermView termName={AcademicTerms.WINTER} termNumber={termNum++}
                                yearNumber={this.props.yearNumber}
                                choiceList={this.props.choiceList}
                                coursesPerTerm={this.props.coursesPerTerm}/>
            <AdvisorAPBTermView termName={AcademicTerms.SPRING} termNumber={termNum++}
                                yearNumber={this.props.yearNumber}
                                choiceList={this.props.choiceList}
                                coursesPerTerm={this.props.coursesPerTerm}/>
            <AdvisorAPBTermView termName={AcademicTerms.SUMMER} termNumber={termNum++}
                                yearNumber={this.props.yearNumber}
                                choiceList={this.props.choiceList}
                                coursesPerTerm={this.props.coursesPerTerm}/>
          </div>) : (
          <div>
            <AdvisorAPBTermView termName={AcademicTerms.FALL} termNumber={termNum++}
                                yearNumber={this.props.yearNumber}
                                choiceList={this.props.choiceList}
                                coursesPerTerm={this.props.coursesPerTerm}/>
            <AdvisorAPBTermView termName={AcademicTerms.SPRING} termNumber={termNum++}
                                yearNumber={this.props.yearNumber}
                                choiceList={this.props.choiceList}
                                coursesPerTerm={this.props.coursesPerTerm}/>
            <AdvisorAPBTermView termName={AcademicTerms.SUMMER} termNumber={termNum++}
                                yearNumber={this.props.yearNumber}
                                choiceList={this.props.choiceList}
                                coursesPerTerm={this.props.coursesPerTerm}/>
          </div>)}
      </Grid.Column>
    );
  }
}

export default AdvisorAPBYearView;
