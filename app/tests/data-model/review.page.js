import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../../imports/ui/utilities/ComponentIDs';

class ReviewPage {
  async addReview(t) {
    const reviewTypeSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_REVIEW_TYPE}`);
    const reviewTypeOption = reviewTypeSelect.find('option');
    const studentSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_STUDENT}`);
    const studentOption = studentSelect.find('option');
    const revieweeSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_REVIEWEE}`);
    const revieweeOption = revieweeSelect.find('option');
    const termSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_ACADEMIC_TERM}`);
    const termOption = termSelect.find('option');
    const ratingSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_RATING}`);
    const commentsSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_COMMENTS}`);
    // const moderatedSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_MODERATED}`);
    // const visibleSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_VISIBLE}`);
    const submitSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_SUBMIT}`);
    const reviewType = 'opportunity';
    const student = 'Ella Zwick (ella@hawaii.edu)';
    const reviewee = 'ACM Manoa';
    const rating = '3';
    const comments = 'ACM Manoa is a wonderful way to connect to other students.';
    await t
      .click(reviewTypeSelect)
      .click(reviewTypeOption.withText(reviewType))
      .expect(reviewTypeSelect.value).eql(reviewType);
    await t
      .click(studentSelect)
      .click(studentOption.withText(student))
      .expect(studentSelect.value).eql(student);
    await t
      .click(revieweeSelect)
      .click(revieweeOption.withText(reviewee))
      .expect(revieweeSelect.value).eql(reviewee);
    await t
      .click(termSelect)
      .click(termOption.withText('Spring 2020'))
      .expect(termSelect.value).eql('Spring 2020');
    await t
      .click(ratingSelect)
      .typeText(ratingSelect, rating)
      .expect(ratingSelect.value).eql(rating);
    await t
      .click(commentsSelect)
      .typeText(commentsSelect, comments)
      .expect(commentsSelect.value).eql(comments);
    await t
      .click(submitSelect);
    // give things time to propagate
    await t.wait(1000);
    await t
      .expect(reviewTypeSelect.value).eql('')
      .expect(studentSelect.value).eql('')
      .expect(revieweeSelect.value).eql('')
      .expect(termSelect.value).eql('')
      .expect(ratingSelect.value).eql('')
      .expect(commentsSelect.value).eql('');
  }
}

export const reviewPage = new ReviewPage();
