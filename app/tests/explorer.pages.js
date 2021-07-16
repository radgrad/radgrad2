import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class ExplorerPages {

  async testAddAndRemove(testController, slugName) {
    await testController.click(`#see-details-${slugName}-button`);
    await testController.click(`#${COMPONENTIDS.ADD_TO_PROFILE_BUTTON}`);
    const removeButton = Selector(`#${COMPONENTIDS.REMOVE_FROM_PROFILE_BUTTON}`);
    await testController.expect(removeButton.exists).ok();
    await testController.click(`#${COMPONENTIDS.REMOVE_FROM_PROFILE_BUTTON}`);
    const addButton = Selector(`#${COMPONENTIDS.ADD_TO_PROFILE_BUTTON}`);
    await testController.expect(addButton.exists).ok();
  }

  async testCareerAddAndRemove(testController, slugName) {
    await testController.click(`#see-details-${slugName}-button`);
    await testController.click(`#${COMPONENTIDS.ADD_TO_PROFILE_MODAL_BUTTON}`);
    await testController.click(`#${COMPONENTIDS.ADD_TO_PROFILE_BUTTON}`);
    const removeButton = Selector(`#${COMPONENTIDS.REMOVE_FROM_PROFILE_BUTTON}`);
    await testController.expect(removeButton.exists).ok();
    await testController.click(`#${COMPONENTIDS.REMOVE_FROM_PROFILE_BUTTON}`);
    const addButton = Selector(`#${COMPONENTIDS.ADD_TO_PROFILE_MODAL_BUTTON}`);
    await testController.expect(addButton.exists).ok();
  }

}

export const explorerPages = new ExplorerPages();
