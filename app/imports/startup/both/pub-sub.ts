import _ from 'lodash';
import { RadGrad } from '../../api/radgrad/RadGrad';
import { AcademicPlans } from '../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../api/academic-term/AcademicTermCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { AdvisorProfiles } from '../../api/user/AdvisorProfileCollection';
import { CareerGoals } from '../../api/career/CareerGoalCollection';
import { Courses } from '../../api/course/CourseCollection';
import { DesiredDegrees } from '../../api/degree-plan/DesiredDegreeCollection';
import { AcademicYearInstances } from '../../api/degree-plan/AcademicYearInstanceCollection';
import { AdvisorLogs } from '../../api/log/AdvisorLogCollection';
import { CourseInstances } from '../../api/course/CourseInstanceCollection';
import { FacultyProfiles } from '../../api/user/FacultyProfileCollection';
import { Feeds } from '../../api/feed/FeedCollection';
import { HelpMessages } from '../../api/help/HelpMessageCollection';
import { Interests } from '../../api/interest/InterestCollection';
import { InterestTypes } from '../../api/interest/InterestTypeCollection';
import { MentorAnswers } from '../../api/mentor/MentorAnswerCollection';
import { MentorProfiles } from '../../api/user/MentorProfileCollection';
import { MentorQuestions } from '../../api/mentor/MentorQuestionCollection';
import { Opportunities } from '../../api/opportunity/OpportunityCollection';
import { OpportunityTypes } from '../../api/opportunity/OpportunityTypeCollection';
import { PageInterestsDailySnapshots } from '../../api/page-tracking/PageInterestsDailySnapshotCollection';
import { PlanChoices } from '../../api/degree-plan/PlanChoiceCollection';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { Reviews } from '../../api/review/ReviewCollection';
import { StudentParticipations } from '../../api/public-stats/StudentParticipationCollection';
import { Slugs } from '../../api/slug/SlugCollection';
import { Teasers } from '../../api/teaser/TeaserCollection';
import { OpportunityInstances } from '../../api/opportunity/OpportunityInstanceCollection';
import { FavoriteAcademicPlans } from '../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../api/favorite/FavoriteOpportunityCollection';
import { FeedbackInstances } from '../../api/feedback/FeedbackInstanceCollection';
import { VerificationRequests } from '../../api/verification/VerificationRequestCollection';
import { PageInterests } from '../../api/page-tracking/PageInterestCollection';

const globalPubSubLite = {
  academicPlan: AcademicPlans.getCollectionName(),
  academicTerm: AcademicTerms.getCollectionName(),
  adminProfile: AdminProfiles.getCollectionName(),
  advisorProfile: AdvisorProfiles.getCollectionName(),
  careerGoal: CareerGoals.getCollectionName(),
  course: Courses.getCollectionName(),
  desiredDegree: DesiredDegrees.getCollectionName(),
  facultyProfile: FacultyProfiles.getCollectionName(),
  feed: Feeds.getCollectionName(),
  helpMessage: HelpMessages.getCollectionName(),
  interest: Interests.getCollectionName(),
  interestType: InterestTypes.getCollectionName(),
  mentorAnswer: MentorAnswers.getCollectionName(),
  mentorProfile: MentorProfiles.getCollectionName(),
  mentorQuestion: MentorQuestions.getCollectionName(),
  opportunity: Opportunities.getCollectionName(),
  opportunityType: OpportunityTypes.getCollectionName(),
  pageInterestsDailySnapshot: PageInterestsDailySnapshots.getCollectionName(),
  planChoice: PlanChoices.getCollectionName(),
  publicStats: PublicStats.getCollectionName(),
  review: Reviews.getCollectionName(),
  studentParticipation: StudentParticipations.getCollectionName(),
  slug: Slugs.getCollectionName(),
  teaser: Teasers.getCollectionName(),
};

const instanceGlobalPubSubLite = {
  courseInstance: CourseInstances.getCollectionName(),
  opportunityInstance: OpportunityInstances.getCollectionName(),
};

const instancePubSubLite = {
  academicYearInstance: AcademicYearInstances.getCollectionName(),
  advisorLog: AdvisorLogs.getCollectionName(),
  courseInstance: CourseInstances.getCollectionName(),
  favoriteAcademicPlan: FavoriteAcademicPlans.getCollectionName(),
  favoriteCareerGoal: FavoriteCareerGoals.getCollectionName(),
  favoriteCourse: FavoriteCourses.getCollectionName(),
  favoriteInterest: FavoriteInterests.getCollectionName(),
  favoriteOpportunity: FavoriteOpportunities.getCollectionName(),
  feedbackInstance: FeedbackInstances.getCollectionName(),
  opportunityInstance: OpportunityInstances.getCollectionName(),
  pageInterest: PageInterests.getCollectionName(),
  verificationRequest: VerificationRequests.getCollectionName(),
};

const pubSubLite = _.concat(_.values(globalPubSubLite), _.values(instancePubSubLite));

export const isPubSubLiteCollection = (collectionName) => _.includes(pubSubLite, collectionName);

export const getGlobalPubSubLiteHandles = () => {
  let handles = _.map(_.values(globalPubSubLite), (collectionName) => RadGrad.getCollection(collectionName).subscribe());
  handles = _.concat(handles, _.map(_.values(instanceGlobalPubSubLite), (collectionName) => RadGrad.getCollection(collectionName).subscribeGlobal()));
  return handles;
};

export const getInstancePubSubLiteHandles = (userID) => _.map(_.values(instancePubSubLite), (collectionName) => RadGrad.getCollection(collectionName).subscribe(userID));
