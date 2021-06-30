import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class ReviewPage {

  async testWriteReview(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_COURSE_OR_OPPORTUNITY}`);
    await testController.click(Selector('option').filter('[value="ICS 311: Algorithms (Course)"]'));
    await testController.click(Selector('span').withText('Average'));
    const ratingsSelector = Selector('div').filter('[role="option"]');
    await testController.click(ratingsSelector.withText('Above average'));
    await testController.typeText(`#${COMPONENTIDS.STUDENT_REVIEW_COMMENT}`, 'This was a great course and would highly recommend people take it.');
    await testController.click(`#${COMPONENTIDS.STUDENT_REVIEW_SUBMIT}`);
    const reviews = Selector(`#${COMPONENTIDS.STUDENT_REVIEW_ITEM}`).count;
    await testController.expect(reviews).eql(2);
  }

}

export const reviewPage = new ReviewPage();
