import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Grid, Message } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { CourseScoreboard, OpportunityScoreboard } from '../../../startup/client/collections';
import { AcademicTerm, Course, HelpMessage, Opportunity, Scoreboard } from '../../../typings/radgrad';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import ScoreboardPageMenu from '../../components/shared/scoreboard/ScoreboardPageMenu';
import { COURSE_SCOREBOARD, OPPORTUNITY_SCOREBOARD } from '../../layouts/utilities/route-constants';
import CourseScoreboardWidget from '../../components/shared/scoreboard/CourseScoreboardWidget';
import OpportunityScoreboardWidget from '../../components/shared/scoreboard/OpportunityScoreboardWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { getMenuWidget } from './utilities/getMenuWidget';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';

export interface ScoreboardPageProps {
  courses: Course[];
  courseScores: Scoreboard[];
  helpMessages: HelpMessage[];
  opportunities: Opportunity[];
  terms: AcademicTerm[];
  oppScores: Scoreboard[];
}

const ScoreboardPage: React.FC<ScoreboardPageProps> = ({ courses, courseScores, helpMessages, opportunities, oppScores, terms }) => {
  const match = useRouteMatch();
  let content = <Message>Choose a scoreboard from the menu to the left.</Message>;
  if (match.path.indexOf(COURSE_SCOREBOARD) !== -1) {
    content = <CourseScoreboardWidget courses={courses} terms={terms} scores={courseScores} />;
  }
  if (match.path.indexOf(OPPORTUNITY_SCOREBOARD) !== -1) {
    content = <OpportunityScoreboardWidget opportunities={opportunities} terms={terms} scores={oppScores} />;
  }
  return (
    <React.Fragment>
      {getMenuWidget(match)}
      <Grid id="scoreboard-page" container stackable padded="vertically">
        <Grid.Row>
          <HelpPanelWidget helpMessages={helpMessages} />
        </Grid.Row>

        <Grid.Column width={3}>
          <ScoreboardPageMenu />
        </Grid.Column>
        <Grid.Column width={13}>
          {content}
        </Grid.Column>
      </Grid>

      <BackToTopButton />
    </React.Fragment>
  );
};

const ScoreboardPageContainer = withTracker(() => {
  const courses = Courses.findNonRetired({ num: { $ne: 'other' } }, { sort: { num: 1 } });
  const helpMessages = HelpMessages.findNonRetired({});
  const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const isQuarterSystem = RadGradProperties.getQuarterSystem();
  const limit = isQuarterSystem ? 12 : 9;
  const terms = AcademicTerms.findNonRetired({ termNumber: { $gte: currentTerm.termNumber } }, {
    sort: { termNumber: 1 },
    limit: limit,
  });
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

export default withListSubscriptions(ScoreboardPageContainer, [
  CourseInstances.getPublicationNames().scoreboard,
  OpportunityInstances.getPublicationNames().scoreboard,
]);
