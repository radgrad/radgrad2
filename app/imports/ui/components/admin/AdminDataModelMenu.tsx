import * as React from 'react';
import { Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink, withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

interface IAdminDataModeMenuProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  academicPlanCount: number;
  academicTermCount: number;
  academicYearCount: number;
  advisorLogCount: number;
  careerGoalCount: number;
  courseInstanceCount: number;
  courseCount: number;
  desiredDegreeCount: number;
  feedCount: number;
  feedbackCount: number;
  helpMessageCount: number;
  interestCount: number;
  interestTypeCount: number;
  mentorAnswerCount: number;
  mentorQuestionCount: number;
  opportunityCount: number;
  opportunityInstanceCount: number;
  opportunityTypeCount: number;
  planChoiceCount: number;
  reviewCount: number;
  slugCount: number;
  teaserCount: number;
  verificationRequestCount: number;
}

const AdminDataModelMenu = (props: IAdminDataModeMenuProps) => {
  const username = props.match.params.username;
  const baseUrl = props.match.url;
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/datamodel/`;
  // console.log(this.props, baseRoute);
  return (
    <Menu vertical={true}>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}academic-plans`}>Academic Plans ({props.academicPlanCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}academic-terms`}>Academic Terms ({props.academicTermCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}academic-year-instances`}>Academic Year Instances ({props.academicYearCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}advisor-logs`}>Advisor Logs ({props.advisorLogCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}career-goals`}>Career Goals ({props.careerGoalCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}course-instances`}>Course Instances ({props.courseInstanceCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}courses`}>Courses ({props.courseCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}desired-degrees`}>Desired Degrees ({props.desiredDegreeCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}feeds`}>Feeds ({props.feedCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}feedback-instances`}>Feedback Instances ({props.feedbackCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}help-messages`}>Help Messages ({props.helpMessageCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}interests`}>Interests ({props.interestCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}interest-types`}>Interest Types ({props.interestTypeCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}mentor-answers`}>Mentor Answers ({props.mentorAnswerCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}mentor-questions`}>Mentor Questions ({props.mentorQuestionCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}opportunities`}>Opportunities ({props.opportunityCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}opportunity-instances`}>Opportunity Instances ({props.opportunityInstanceCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}opportunity-types`}>Opportunity Types ({props.opportunityTypeCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}plan-choices`}>Plan Choices ({props.planChoiceCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}reviews`}>Reviews ({props.reviewCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}slugs`}>Slugs ({props.slugCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}teasers`}>Teasers ({props.teaserCount})</Menu.Item>
      <Menu.Item as={NavLink} exact={true} to={`${baseRoute}verification-requests`}>Verification Requests ({props.verificationRequestCount})</Menu.Item>
    </Menu>
  );
};

const AdminDataModelMenuContainer = withTracker(() => ({
  academicPlanCount: AcademicPlans.count(),
  academicTermCount: AcademicTerms.count(),
  academicYearCount: AcademicYearInstances.count(),
  advisorLogCount: AdvisorLogs.count(),
  careerGoalCount: CareerGoals.count(),
  courseInstanceCount: CourseInstances.count(),
  courseCount: Courses.count(),
  desiredDegreeCount: DesiredDegrees.count(),
  feedCount: Feeds.count(),
  feedbackCount: FeedbackInstances.count(),
  helpMessageCount: HelpMessages.count(),
  interestCount: Interests.count(),
  interestTypeCount: InterestTypes.count(),
  mentorAnswerCount: MentorAnswers.count(),
  mentorQuestionCount: MentorQuestions.count(),
  opportunityCount: Opportunities.count(),
  opportunityInstanceCount: OpportunityInstances.count(),
  opportunityTypeCount: OpportunityTypes.count(),
  planChoiceCount: PlanChoices.count(),
  reviewCount: Reviews.count(),
  slugCount: Slugs.count(),
  teaserCount: Teasers.count(),
  verificationRequestCount: VerificationRequests.count(),
}))(AdminDataModelMenu);
export default withRouter(AdminDataModelMenuContainer);
