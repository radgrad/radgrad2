import { Courses } from '../../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import { Reviews } from '../../../../../api/review/ReviewCollection';
import { Review } from '../../../../../typings/radgrad';

export const getRevieweeName = (review: Review): string => {
  let itemName;
  switch (review.reviewType) {
    case Reviews.COURSE: {
      const course = Courses.findDoc(review.revieweeID);
      itemName = Courses.getName(course._id);
      break;
    }
    case Reviews.OPPORTUNITY: {
      const opp = Opportunities.findDoc(review.revieweeID);
      itemName = opp.name;
      break;
    }
    default:
      itemName = '';
  }
  return itemName;
};
