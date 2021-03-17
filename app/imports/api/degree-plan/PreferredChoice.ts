import _ from 'lodash';

/**
 * Class that can calculate the preferred choice given an array of interests.
 * @memberOf api/degree-plan
 */
class PreferredChoice {
  private readonly rankedChoices: any;

  private readonly max: number;

  /**
   * Creates a new PreferredChoice instance given the array of choices and array of interestIDs.
   * @param choices
   * @param interestIDs
   */
  constructor(choices, interestIDs: string[]) {
    this.rankedChoices = {};
    let max = 0;
    choices.forEach((choice) => {
      const score = _.intersection(choice.interestIDs, interestIDs).length;
      if (score > max) {
        max = score;
      }
      if (!this.rankedChoices[score]) {
        this.rankedChoices[score] = [];
      }
      this.rankedChoices[score].push(choice);
    });
    this.max = max;
  }

  /**
   * Returns an array of the choices that best match the interestIDs.
   * @returns {*} an array of the choices that best match the interests.
   */
  public getBestChoices() {
    return this.rankedChoices[this.max];
  }

  /**
   * Returns an array with the best matches first.
   * @returns {Array}
   */
  public getOrderedChoices() {
    let choices = [];
    for (let i = this.max; i >= 0; i--) {
      if (this.rankedChoices[i]) {
        choices = choices.concat(this.rankedChoices[i]);
      }
    }
    // console.log(this.max, choices);
    return choices;
  }

  /**
   * Returns true if there are any preferences.
   * @return {boolean} true if max !== 0.
   */
  public hasPreferences() {
    return this.max !== 0;
  }
}

export default PreferredChoice;
