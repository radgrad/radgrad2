import React from 'react';
import CourseForecast from '../../components/shared/forecast/CourseForecast';
import OpportunityForecast from '../../components/shared/forecast/OpportunityForecast';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Use forecasts to predict future enrollment';
const headerPaneBody = `
When students add courses to their Degree Plan, information is provided about potential future enrollment.

This page provides summary statistics about student interest in courses and opportunities for future semesters.

For more information, please see the [Faculty User Guide](https://www.radgrad.org/docs/users/faculty/overview?target=_blank).
`;

const ForecastPage: React.FC = () => (
  <PageLayout id={PAGEIDS.FORECASTS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <CourseForecast />
    <OpportunityForecast />
  </PageLayout>
);

export default ForecastPage;
