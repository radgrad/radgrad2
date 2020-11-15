import React from 'react';
import { Grid } from 'semantic-ui-react';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import AdvisorAPBYearView from './AdvisorAPBYearView';

interface IAdvisorAPBPlanViewWidgetProps {
  coursesPerTerm: number[];
  choiceList: string[];
}

const AdvisorAPBPlanViewWidget = (props: IAdvisorAPBPlanViewWidgetProps) => {
  const quarterSystem = RadGradProperties.getQuarterSystem();
  return (
    <Grid widths="equal" columns={5}>
      <AdvisorAPBYearView
        yearNumber={1}
        choiceList={props.choiceList}
        quarterSystem={quarterSystem}
        coursesPerTerm={props.coursesPerTerm}
      />
      <AdvisorAPBYearView
        yearNumber={2}
        choiceList={props.choiceList}
        quarterSystem={quarterSystem}
        coursesPerTerm={props.coursesPerTerm}
      />
      <AdvisorAPBYearView
        yearNumber={3}
        choiceList={props.choiceList}
        quarterSystem={quarterSystem}
        coursesPerTerm={props.coursesPerTerm}
      />
      <AdvisorAPBYearView
        yearNumber={4}
        choiceList={props.choiceList}
        quarterSystem={quarterSystem}
        coursesPerTerm={props.coursesPerTerm}
      />
      <AdvisorAPBYearView
        yearNumber={5}
        choiceList={props.choiceList}
        quarterSystem={quarterSystem}
        coursesPerTerm={props.coursesPerTerm}
      />
    </Grid>
  );
};

export default AdvisorAPBPlanViewWidget;
