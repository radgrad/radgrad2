import _ from 'lodash';
import { Users } from '../../app/imports/api/user/UserCollection';
import { Interests } from '../../app/imports/api/interest/InterestCollection';
import { Interest } from '../../app/imports/typings/radgrad';

interface HasInterests {
  interestIDs: string[];
}

class MatchingInterestsClass {
  /**
   * Returns the IInterests that match between ids1 and ids2.
   * @param {string[]} ids1
   * @param {string[]} ids2
   * @returns {Interest[]}
   */
  private matchingInterests(ids1: string[], ids2: string[]): Interest[] {
    const matchingIDs = _.intersection(ids1, ids2);
    return matchingIDs.map((id) => Interests.findDoc(id));
  }

  /**
   * Returns the matching user Interests for username and item.
   * @param {string} username the name of the user.
   * @param {HasInterests} item the item with interestIDs.
   * @returns {Interest[]}
   */
  public matchingUserInterests(username: string, item: HasInterests) {
    const userInterestIDs = Users.getInterestIDs(username);
    return this.matchingInterests(userInterestIDs, item.interestIDs);
  }

  /**
   * Returns the Interests that don't match the user's interests.
   * @param {string} username the user.
   * @param {HasInterests} item the item.
   * @returns {Interest[]}
   */
  public notMatchingInterests(username: string, item: HasInterests) {
    const userInterestIDs = Users.getInterestIDs(username);
    const matches = this.matchingInterests(userInterestIDs, item.interestIDs);
    const itemInterests = item.interestIDs.map((id) => Interests.findDoc(id));
    return itemInterests.filter((courseInterest) => {
      let ret = true;
      matches.forEach((matchingInterest) => {
        if (_.isEqual(courseInterest, matchingInterest)) {
          ret = false;
        }
      });
      return ret;
    });
  }
}

export const MatchingInterests = new MatchingInterestsClass();
