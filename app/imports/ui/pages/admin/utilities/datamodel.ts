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
import { Reviews } from '../../../../api/review/ReviewCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { Teasers } from '../../../../api/teaser/TeaserCollection';
import { Users } from '../../../../api/user/UserCollection';
import { VerificationRequests } from '../../../../api/verification/VerificationRequestCollection';

export function makeMarkdownLink(url: string): string {
  return (url) ? `[${url}](${url})` : ' ';
}

export const makeYoutubeLink = (url: string): string => (url ? `https://youtu.be/${url}` : '');

export const getDatamodelCount = () => {
  const academicTermCount = AcademicTerms.count();
  const academicYearCount = AcademicYearInstances.count();
  const advisorLogCount = AdvisorLogs.count();
  const careerGoalCount = CareerGoals.count();
  const courseInstanceCount = CourseInstances.count();
  const courseCount = Courses.count();
  const feedCount = Feeds.count();
  const feedbackCount = FeedbackInstances.count();
  const helpMessageCount = HelpMessages.count();
  const interestCount = Interests.count();
  const interestTypeCount = InterestTypes.count();
  const opportunityCount = Opportunities.count();
  const opportunityInstanceCount = OpportunityInstances.count();
  const opportunityTypeCount = OpportunityTypes.count();
  const reviewCount = Reviews.count();
  const slugCount = Slugs.count();
  const teaserCount = Teasers.count();
  const usersCount = Users.count();
  const verificationRequestCount = VerificationRequests.count();
  return {
    academicTermCount,
    academicYearCount,
    advisorLogCount,
    careerGoalCount,
    courseInstanceCount,
    courseCount,
    feedCount,
    feedbackCount,
    helpMessageCount,
    interestCount,
    interestTypeCount,
    opportunityCount,
    opportunityInstanceCount,
    opportunityTypeCount,
    reviewCount,
    slugCount,
    teaserCount,
    usersCount,
    verificationRequestCount,
  };
};
