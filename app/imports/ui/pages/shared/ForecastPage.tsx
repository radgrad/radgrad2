import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { AcademicTerm, Course, Opportunity, Forecast } from '../../../typings/radgrad';
import CourseForecast from '../../components/shared/forecast/CourseForecast';
import OpportunityForecast from '../../components/shared/forecast/OpportunityForecast';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

export interface ForecastPageProps {
  courses: Course[];
  opportunities: Opportunity[];
  terms: AcademicTerm[];
}

const headerPaneTitle = 'Use forecasts to predict future enrollment';
const headerPaneBody = `
When students add courses to their Degree Plan, information is provided about potential future enrollment.

This page provides summary statistics about student interest in courses and opportunities for future semesters.

For more information, please see the [Faculty User Guide](https://www.radgrad.org/docs/users/faculty/overview?target=_blank).
`;

const ForecastPage: React.FC<ForecastPageProps> = ({ courses, opportunities, terms }) => (
    <PageLayout id={PAGEIDS.FORECASTS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <CourseForecast />
      <OpportunityForecast opportunities={opportunities} terms={terms} />
    </PageLayout>
);

const ForecastPageContainer = withTracker(() => {
  const courses = Courses.findNonRetired({ num: { $ne: 'other' } }, { sort: { num: 1 } });
  const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const isQuarterSystem = RadGradProperties.getQuarterSystem();
  const limit = isQuarterSystem ? 12 : 9;
  const terms = AcademicTerms.findNonRetired(
    { termNumber: { $gte: currentTerm.termNumber } },
    {
      sort: { termNumber: 1 },
      limit: limit,
    },
  );
  return {
    courses,
    opportunities,
    terms,
  };
})(ForecastPage);

export default ForecastPageContainer;
