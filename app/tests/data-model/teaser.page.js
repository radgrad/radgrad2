import {
  authorSelector,
  descriptionSelector,
  durationSelector,
  errorFieldSelector,
  interestNames,
  interestsOption,
  interestsSelector,
  sponsorNames,
  submitSelector,
  targetSlugOption,
  targetSlugSelector,
  titleSelector,
  youtubeIdSelector,
} from './selectors';

class TeaserPage {
  async addTeaser(t) {
    const title = 'ICS 103: Introduction to Computer Science Principles';
    await t
      .typeText(titleSelector, title)
      .expect(titleSelector.value).eql(title);
    const author = sponsorNames.henric;
    await t
      .typeText(authorSelector, author)
      .expect(authorSelector.value).eql(author);
    const targetSlug = 'ics_103 (Course)';
    await t
      .click(targetSlugSelector)
      .click(targetSlugOption.withText(targetSlug))
      .expect(targetSlugSelector.value).eql(targetSlug);
    const youtubeID = 'Youtube ID';
    await t
      .typeText(youtubeIdSelector, youtubeID)
      .expect(youtubeIdSelector.value).eql(youtubeID);
    const duration = '3:42';
    await t
      .typeText(durationSelector, duration)
      .expect(durationSelector.value).eql(duration);
    const description = 'Teaser about ICS 103.';
    await t
      .typeText(descriptionSelector, description)
      .expect(descriptionSelector.value).eql(description);
    await t
      .click(interestsSelector)
      .click(interestsOption.withText(interestNames.dot_net))
      .click(interestsOption.withText(interestNames.c_sharp));
    // submit the form
    await t.click(submitSelector);
    await t.expect(errorFieldSelector.exists).notOk;
    // give things time to propagate
    await t.wait(1000);
    await t
      .expect(titleSelector.value).eql('')
      .expect(authorSelector.value).eql('');
  }
}

export const teaserPage = new TeaserPage();
