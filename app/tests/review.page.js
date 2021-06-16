import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class ReviewPage {

  async testWriteReview(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_COURSE_OR_OPPORTUNITY}`);
    await testController.click('option');
  }

}

export const reviewPage = new ReviewPage();