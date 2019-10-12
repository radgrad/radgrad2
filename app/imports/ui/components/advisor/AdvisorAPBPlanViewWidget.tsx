import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import AdvisorAPBYearView from './AdvisorAPBYearView';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';

interface IAdvisorAPBPlanViewWidgetProps {
  coursesPerTerm: number[];
  choiceList: string[];
}

const AdvisorAPBPlanViewWidget = (props: IAdvisorAPBPlanViewWidgetProps) => {
  const quarterSystem = RadGradSettings.findOne({}).quarterSystem;
  return (
    <Grid widths='equal' columns={5}>
      <AdvisorAPBYearView yearNumber={1} choiceList={props.choiceList} quarterSystem={quarterSystem}
                          coursesPerTerm={props.coursesPerTerm}/>
      <AdvisorAPBYearView yearNumber={2} choiceList={props.choiceList} quarterSystem={quarterSystem}
                          coursesPerTerm={props.coursesPerTerm}/>
      <AdvisorAPBYearView yearNumber={3} choiceList={props.choiceList} quarterSystem={quarterSystem}
                          coursesPerTerm={props.coursesPerTerm}/>
      <AdvisorAPBYearView yearNumber={4} choiceList={props.choiceList} quarterSystem={quarterSystem}
                          coursesPerTerm={props.coursesPerTerm}/>
      <AdvisorAPBYearView yearNumber={5} choiceList={props.choiceList} quarterSystem={quarterSystem}
                          coursesPerTerm={props.coursesPerTerm}/>
    </Grid>
  );
};

export default AdvisorAPBPlanViewWidget;
