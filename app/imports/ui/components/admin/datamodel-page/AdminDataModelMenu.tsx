import React from 'react';
import { Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink, withRouter } from 'react-router-dom';
import { AcademicPlans } from '../../../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { AcademicYearInstances } from '../../../../api/degree-plan/AcademicYearInstanceCollection';
import { AdvisorLogs } from '../../../../api/log/AdvisorLogCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Feeds } from '../../../../api/feed/FeedCollection';
import { FeedbackInstances } from '../../../../api/feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../../api/interest/InterestTypeCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../../../../api/opportunity/OpportunityTypeCollection';
import { PlanChoices } from '../../../../api/degree-plan/PlanChoiceCollection';
import { Reviews } from '../../../../api/review/ReviewCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { Teasers } from '../../../../api/teaser/TeaserCollection';
import { VerificationRequests } from '../../../../api/verification/VerificationRequestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { leftHandMenu } from '../../shared/shared-widget-names';

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
  feedCount: number;
  feedbackCount: number;
  helpMessageCount: number;
  interestCount: number;
  interestTypeCount: number;
  opportunityCount: number;
  opportunityInstanceCount: number;
  opportunityTypeCount: number;
  planChoiceCount: number;
  reviewCount: number;
  slugCount: number;
  teaserCount: number;
  usersCount: number;
  verificationRequestCount: number;
}

const AdminDataModelMenu = (props: IAdminDataModeMenuProps) => {
  const username = props.match.params.username;
  const baseUrl = props.match.url;
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/datamodel/`;
  // console.log(this.props, baseRoute);
  return (
    <Menu vertical text id={`${leftHandMenu}`}>
      <Menu.Item id="data-model-academic-plans" as={NavLink} exact to={`${baseRoute}academic-plans`}>
        Academic Plans ({props.academicPlanCount})
      </Menu.Item>
      <Menu.Item id="data-model-academic-terms" as={NavLink} exact to={`${baseRoute}academic-terms`}>
        Academic Terms ({props.academicTermCount})
      </Menu.Item>
      <Menu.Item id="data-model-academic-year-instances" as={NavLink} exact to={`${baseRoute}academic-year-instances`}>
        Academic Year Instances ({props.academicYearCount})
      </Menu.Item>
      <Menu.Item id="data-model-advisor-logs" as={NavLink} exact to={`${baseRoute}advisor-logs`}>
        Advisor Logs ({props.advisorLogCount})
      </Menu.Item>
      <Menu.Item id="data-model-career-goals" as={NavLink} exact to={`${baseRoute}career-goals`}>
        Career Goals ({props.careerGoalCount})
      </Menu.Item>
      <Menu.Item id="data-model-course-instances" as={NavLink} exact to={`${baseRoute}course-instances`}>
        Course Instances ({props.courseInstanceCount})
      </Menu.Item>
      <Menu.Item id="data-model-courses" as={NavLink} exact to={`${baseRoute}courses`}>
        Courses ({props.courseCount})
      </Menu.Item>
      <Menu.Item id="data-model-feeds" as={NavLink} exact to={`${baseRoute}feeds`}>
        Feeds ({props.feedCount})
      </Menu.Item>
      <Menu.Item id="data-model-feedback-instances" as={NavLink} exact to={`${baseRoute}feedback-instances`}>
        Feedback Instances ({props.feedbackCount})
      </Menu.Item>
      <Menu.Item id="data-model-help-messages" as={NavLink} exact to={`${baseRoute}help-messages`}>
        Help Messages ({props.helpMessageCount})
      </Menu.Item>
      <Menu.Item id="data-model-interests" as={NavLink} exact to={`${baseRoute}interests`}>
        Interests ({props.interestCount})
      </Menu.Item>
      <Menu.Item id="data-model-interest-types" as={NavLink} exact to={`${baseRoute}interest-types`}>
        Interest Types ({props.interestTypeCount})
      </Menu.Item>
      <Menu.Item id="data-model-opportunities" as={NavLink} exact to={`${baseRoute}opportunities`}>
        Opportunities ({props.opportunityCount})
      </Menu.Item>
      <Menu.Item id="data-model-opportunity-instances" as={NavLink} exact to={`${baseRoute}opportunity-instances`}>
        Opportunity Instances ({props.opportunityInstanceCount})
      </Menu.Item>
      <Menu.Item id="data-model-opportunity-types" as={NavLink} exact to={`${baseRoute}opportunity-types`}>
        Opportunity Types ({props.opportunityTypeCount})
      </Menu.Item>
      <Menu.Item id="data-model-plan-choices" as={NavLink} exact to={`${baseRoute}plan-choices`}>
        Plan Choices ({props.planChoiceCount})
      </Menu.Item>
      <Menu.Item id="data-model-reviews" as={NavLink} exact to={`${baseRoute}reviews`}>
        Reviews ({props.reviewCount})
      </Menu.Item>
      <Menu.Item id="data-model-slugs" as={NavLink} exact to={`${baseRoute}slugs`}>
        Slugs ({props.slugCount})
      </Menu.Item>
      <Menu.Item id="data-model-teasers" as={NavLink} exact to={`${baseRoute}teasers`}>
        Teasers ({props.teaserCount})
      </Menu.Item>
      <Menu.Item id="data-model-users" as={NavLink} exact to={`${baseRoute}users`}>
        Users ({props.usersCount})
      </Menu.Item>
      <Menu.Item id="data-model-verification-requests" as={NavLink} exact to={`${baseRoute}verification-requests`}>
        Verification Requests ({props.verificationRequestCount})
      </Menu.Item>
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
  feedCount: Feeds.count(),
  feedbackCount: FeedbackInstances.count(),
  helpMessageCount: HelpMessages.count(),
  interestCount: Interests.count(),
  interestTypeCount: InterestTypes.count(),
  opportunityCount: Opportunities.count(),
  opportunityInstanceCount: OpportunityInstances.count(),
  opportunityTypeCount: OpportunityTypes.count(),
  planChoiceCount: PlanChoices.count(),
  reviewCount: Reviews.count(),
  slugCount: Slugs.count(),
  teaserCount: Teasers.count(),
  usersCount: Users.count(),
  verificationRequestCount: VerificationRequests.count(),
}))(AdminDataModelMenu);

export default withRouter(AdminDataModelMenuContainer);
