import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { CourseScoreboard, OpportunityScoreboard } from '../../../startup/client/collections';
import { AcademicTerm, Course, Opportunity, Scoreboard } from '../../../typings/radgrad';
import CourseScoreboardWidget from '../../components/shared/scoreboard/CourseScoreboardWidget';
import OpportunityScoreboardWidget from '../../components/shared/scoreboard/OpportunityScoreboardWidget';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import PageLayout from '../PageLayout';

export interface ScoreboardPageProps {
  courses: Course[];
  courseScores: Scoreboard[];
  opportunities: Opportunity[];
  terms: AcademicTerm[];
  oppScores: Scoreboard[];
}

const headerPaneTitle = 'Use scoreboards to predict future enrollment';
const headerPaneBody = `
When students add courses to their Degree Plan, information is provided about potential future enrollment.

This page provides summary statistics about student interest in courses and opportunities for future semesters.

For more information, please see the [Faculty User Guide](https://www.radgrad.org/docs/users/faculty/overview).
`;

const ScoreboardPage: React.FC<ScoreboardPageProps> = ({ courses, courseScores, opportunities, oppScores, terms }) => (
    <PageLayout id="scoreboard-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      <CourseScoreboardWidget courses={courses} terms={terms} scores={courseScores} />
      <OpportunityScoreboardWidget opportunities={opportunities} terms={terms} scores={oppScores} />
    </PageLayout>
);

const ScoreboardPageContainer = withTracker(() => {
  const courses = Courses.findNonRetired({ num: { $ne: 'other' } }, { sort: { num: 1 } });
  const helpMessages = HelpMessages.findNonRetired({});
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
  const courseScores = CourseScoreboard.find().fetch();
  const oppScores = OpportunityScoreboard.find().fetch();
  return {
    courses,
    courseScores,
    helpMessages,
    opportunities,
    oppScores,
    terms,
  };
})(ScoreboardPage);

export default withListSubscriptions(ScoreboardPageContainer, [CourseInstances.getPublicationNames().scoreboard, OpportunityInstances.getPublicationNames().scoreboard]);
