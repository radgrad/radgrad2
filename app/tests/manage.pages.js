import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class ManagePages {

  async clickFilteredStudentsTabAndVerify(testController) {
    await testController.click(`#${COMPONENTIDS.UPDATE_TAB}`);
    await testController.click(`#${COMPONENTIDS.FILTERED_STUDENTS_TAB}`);
    const componentSelector = Selector(`#${COMPONENTIDS.FILTERED_STUDENTS_GRID}`);
    await testController.expect(componentSelector.exists).ok();
  }

  async clickFilteredAlumniTabAndVerify(testController) {
    await testController.click(`#${COMPONENTIDS.UPDATE_TAB}`);
    await testController.click(`#${COMPONENTIDS.FILTERED_ALUMNI_TAB}`);
    const componentSelector = Selector(`#${COMPONENTIDS.FILTERED_ALUMNI_GRID}`);
    await testController.expect(componentSelector.exists).ok();
  }

  async clickAddNewTabAndVerify(testController) {
    await testController.click(`#${COMPONENTIDS.ADD_NEW_TAB}`);
    const componentSelector = Selector(`#${COMPONENTIDS.ADD_STUDENT_TAB_PANE}`);
    await testController.expect(componentSelector.exists).ok();
  }

  async clickOtherTabAndVerify(testController) {
    await testController.click(`#${COMPONENTIDS.OTHER_TAB}`);
    const componentSelector = Selector(`#${COMPONENTIDS.OTHER_TAB_PANE}`);
    await testController.expect(componentSelector.exists).ok();
  }

  async clickMatriculateTabAndVerify(testController) {
    await testController.click(`#${COMPONENTIDS.MATRICULATE_TAB}`);
    const componentSelector = Selector(`#${COMPONENTIDS.MATRICULATE_STUDENTS_TAB_PANE}`);
    await testController.expect(componentSelector.exists).ok();
  }

  async addNewStudent(testController) {
    await testController.typeText(`#${COMPONENTIDS.ADVISOR_ADD_FIRST_NAME}`, 'John');
    await testController.typeText(`#${COMPONENTIDS.ADVISOR_ADD_LAST_NAME}`, 'Doe');
    await testController.typeText(`#${COMPONENTIDS.ADVISOR_ADD_USERNAME}`, 'johndoe@hawaii.edu');
    await testController.click(`#${COMPONENTIDS.ADVISOR_ADD_STUDENT_BUTTON}`);
  }

  async testStudentFilter(testController) {
    await testController.typeText(`#${COMPONENTIDS.ADVISOR_FILTER_FIRST_NAME}`, 'John');
    await testController.typeText(`#${COMPONENTIDS.ADVISOR_FILTER_LAST_NAME}`, 'Doe');
    const componentSelector = Selector(`#${COMPONENTIDS.MANAGE_STUDENT_ITEM}`).count;
    await testController.expect(componentSelector).eql(1);
  }

  async clickEditOpportunities(testController) {
    await testController.click(`#${COMPONENTIDS.EDIT_OPPORTUNITY_BUTTON}`);
    const componentSelector = Selector(`#${COMPONENTIDS.EDIT_OPPORTUNITY_BUTTON}`);
    await testController.expect(componentSelector.exists).ok();
  }

  async studentRequestVerification(testController) {
    // clears all the unverified opportunities
    const unverifiedOpportunities = Selector(`#${COMPONENTIDS.STUDENT_REQUEST_VERIFICATION_BUTTON}`);
    const numUnverified = await unverifiedOpportunities.count;
    // console.log(numUnverified);
    // clear all the unverified opportunities
    for (let i = 0; i < numUnverified; i++) {
      // eslint-disable-next-line no-await-in-loop
      await testController.click(`#${COMPONENTIDS.STUDENT_REQUEST_VERIFICATION_BUTTON}`);
      // eslint-disable-next-line no-await-in-loop
      await testController.typeText(`#${COMPONENTIDS.STUDENT_REQUEST_VERIFICATION_INPUT}`, 'Attended meetings');
      // eslint-disable-next-line no-await-in-loop
      await testController.click(`#${COMPONENTIDS.STUDENT_REQUEST_VERIFICATION_SUBMIT}`);
    }

    const componentSelector = Selector(`#${COMPONENTIDS.STUDENT_REQUEST_VERIFICATION_BUTTON}`);
    await testController.expect(componentSelector.exists).notOk(); // There should be no more unverified opportunities
  }
}

export const managePages = new ManagePages();
