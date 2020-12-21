import React from 'react';
import { Grid } from 'semantic-ui-react';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import AdvisorAPBYearView from './AdvisorAPBYearView';

interface AdvisorAPBPlanViewWidgetProps {
  coursesPerTerm: number[];
  choiceList: string[];
}

const AdvisorAPBPlanViewWidget: React.FC<AdvisorAPBPlanViewWidgetProps> = ({ coursesPerTerm, choiceList }) => {
  const quarterSystem = RadGradProperties.getQuarterSystem();
  return (
    <Grid widths="equal" columns={5}>
      <AdvisorAPBYearView
        yearNumber={1}
        choiceList={choiceList}
        quarterSystem={quarterSystem}
        coursesPerTerm={coursesPerTerm}
      />
      <AdvisorAPBYearView
        yearNumber={2}
        choiceList={choiceList}
        quarterSystem={quarterSystem}
        coursesPerTerm={coursesPerTerm}
      />
      <AdvisorAPBYearView
        yearNumber={3}
        choiceList={choiceList}
        quarterSystem={quarterSystem}
        coursesPerTerm={coursesPerTerm}
      />
      <AdvisorAPBYearView
        yearNumber={4}
        choiceList={choiceList}
        quarterSystem={quarterSystem}
        coursesPerTerm={coursesPerTerm}
      />
      <AdvisorAPBYearView
        yearNumber={5}
        choiceList={choiceList}
        quarterSystem={quarterSystem}
        coursesPerTerm={coursesPerTerm}
      />
    </Grid>
  );
};

export default AdvisorAPBPlanViewWidget;
