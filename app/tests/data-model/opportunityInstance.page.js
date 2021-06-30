import {
  errorFieldSelector,
  opportunityOption,
  opportunitySelector, sponsorNames, sponsorOption, sponsorSelector,
  studentNames,
  studentOption,
  studentSelector, submitSelector,
  termOption,
  termSelector, verifiedSelector,
} from './selectors';

class OpportunityInstancePage {
  async addOpportunityInstance(t) {
    const currentTerm = 'Summer 2021'; // TODO update this when it changes.
    const academicTermName = 'Fall 2022';
    await t
      .click(termSelector)
      .click(termOption.withText(academicTermName))
      .expect(termSelector.value).eql(academicTermName);
    const studentName = studentNames.betty;
    await t
      .click(studentSelector)
      .click(studentOption.withText(studentName))
      .expect(studentSelector.value).eql(studentName);
    const opportunity = 'AllNet';
    await t
      .click(opportunitySelector)
      .click(opportunityOption.withText(opportunity))
      .expect(opportunitySelector.value).eql(opportunity);
    const sponsor = sponsorNames.esb;
    await t
      .click(sponsorSelector)
      .click(sponsorOption.withText(sponsor))
      .expect(sponsorSelector.value).eql(sponsor);
    await t
      .click(verifiedSelector)
      .expect(verifiedSelector.value).ok;
    await t.click(submitSelector);
    await t.expect(errorFieldSelector.exists).notOk;
    await t.wait(500);
    await t
      .expect(termSelector.value).eql(currentTerm)
      .expect(studentSelector.value).eql(studentNames.abi);
  }
}

export const opportunityInstancePage = new OpportunityInstancePage();
