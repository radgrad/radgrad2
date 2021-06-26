import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../../imports/ui/utilities/ComponentIDs';

class AcademicYearPage {
  async addAcademicYearInstance(t) {
    const year = 2021; // will need to update this.
    const nextYear = `${year + 1}`;
    const student = 'abi@hawaii.edu';
    const studentSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_STUDENT}`);
    const studentOption = studentSelect.find('option');
    const yearSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_YEAR}`);
    await t
      .click(studentSelect)
      .click(studentOption.withText(student))
      .expect(studentSelect.value).eql(student);
    await t.selectText(yearSelect)
      .typeText(yearSelect, nextYear)
      .expect(yearSelect.value).eql(nextYear);
    // Submit the data.
    await t.click(`#${COMPONENTIDS.DATA_MODEL_SUBMIT}`);
    // give things time to propagate
    await t.wait(1000);
    // Check that the form reset.
    await t
      .expect(yearSelect.value).eql(`${year}`)
      .expect(studentSelect.value).eql('');
  }
}

export const academicYearPage = new AcademicYearPage();
