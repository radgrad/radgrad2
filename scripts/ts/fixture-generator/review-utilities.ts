import { getAcademicTerm } from './academic-term-utilities';
import AcademicTermCollection from './AcademicTermCollection';
// eslint-disable-next-line no-unused-vars
import RadGradCollection from './RadGradCollection';
// eslint-disable-next-line no-unused-vars
import { PlanReviewItem } from './user-config-file.js';

enum ReviewType {
  // eslint-disable-next-line no-unused-vars
  COURSE = 'course',
  // eslint-disable-next-line no-unused-vars
  OPPORTUNITY = 'opportunity',
}

type ReviewRatings = 1 | 2 | 3 | 4 | 5;

interface Review {
  slug?: string;
  student: string;
  reviewType: ReviewType;
  reviewee: string;
  academicTerm: string;
  rating?: ReviewRatings;
  comments?: string;
  moderated?: boolean;
  visible?: boolean;
  moderatorComments?: string;
  retired?: boolean;
}

const buildReivewSlug = (student: string, reviewee: string, term: string) => `review-${student.substr(0, student.indexOf('@'))}-${reviewee}-${term}`;

export const generateReview = (student: string, planItem: PlanReviewItem, academicTerms: AcademicTermCollection, opportunities: RadGradCollection): Review => {
  const currentTerm = academicTerms.getCurrentTerm();
  const quarters = academicTerms.isQuarterSystem();
  const academicTerm = getAcademicTerm(currentTerm, planItem.academicYearOffset, planItem.termNum, quarters);
  const slug = buildReivewSlug(student, planItem.reviewee, academicTerm);
  let reviewType = ReviewType.COURSE;
  if (opportunities.isDefinedSlug(planItem.reviewee)) {
    reviewType = ReviewType.OPPORTUNITY;
  }
  const rating: ReviewRatings = planItem.rating as ReviewRatings;
  const reviewee = planItem.reviewee;
  const comments = planItem.comments;
  const moderated = Math.random() < 0.5;
  return {
    slug,
    student,
    reviewee,
    reviewType,
    academicTerm,
    rating,
    comments,
    moderated,
  };
};
