import {
  descriptionSelector, errorFieldSelector,
  eventDate1Selector, iceCSelector,
  iceESelector,
  iceISelector,
  interestNames,
  interestsOption,
  interestsSelector,
  nameSelector,
  opportunityTypeOption,
  opportunityTypeSelector,
  pictureSelector,
  sponsorNames,
  sponsorOption,
  sponsorSelector, submitSelector,
} from './selectors';

class OpportunityPage {
  async addOpportunity(t) {
    const name = 'The most important opportunity available';
    await t
      .typeText(nameSelector, name)
      .expect(nameSelector.value).eql(name);
    const opportunityType = 'Project';
    await t
      .click(opportunityTypeSelector)
      .click(opportunityTypeOption.withText(opportunityType))
      .expect(opportunityTypeSelector.value).eql(opportunityType);
    const sponsor = sponsorNames.psadow;
    await t
      .click(sponsorSelector)
      .click(sponsorOption.withText(sponsor))
      .expect(sponsorSelector.value).eql(sponsor);
    const description = 'This opportunity is knocking. You need to sign up now.';
    await t
      .typeText(descriptionSelector, description)
      .expect(descriptionSelector.value).eql(description);
    await t
      .click(interestsSelector)
      .click(interestsOption.withText(interestNames.civic_engagement))
      .click(interestsOption.withText(interestNames.data_science));
    const picture = 'https://mywebsite.com/picture';
    await t
      .typeText(pictureSelector, picture)
      .expect(pictureSelector.value).eql(picture);
    const eventDate1 = '2021-07-04';
    await t
      .click(eventDate1Selector)
      .typeText(eventDate1Selector, eventDate1)
      .expect(eventDate1Selector.value).eql(eventDate1);
    const i = '10';
    await t
      .typeText(iceISelector, i)
      .expect(iceISelector.value).eql(i);
    const c = '0';
    await t
      .typeText(iceCSelector, c)
      .expect(iceCSelector.value).eql(c);
    const e = '15';
    await t
      .typeText(iceESelector, e)
      .expect(iceESelector.value).eql(e);
    await t.click(submitSelector);
    await t.expect(errorFieldSelector.exists).notOk;
    // give things time to propagate
    await t.wait(2000);
    await t
      .expect(nameSelector.value).eql('')
      .expect(pictureSelector.value).eql('')
      .expect(descriptionSelector.value).eql('');

  }
}

export const opportunityPage = new OpportunityPage();
