import * as _ from 'lodash';
import { Users } from '../user/UserCollection';
import { Interests } from './InterestCollection';
import { IInterest } from '../../typings/radgrad';

interface IHasInterests {
  interestIDs: string[];
}

class MatchingInterestsClass {
  /**
   * Returns the IInterests that match between ids1 and ids2.
   * @param {string[]} ids1
   * @param {string[]} ids2
   * @returns {IInterest[]}
   */
  private matchingInterests(ids1: string[], ids2: string[]): IInterest[] {
    const matching = [];
    const interests1 = _.map(ids1, (id) => Interests.findDoc(id));
    const interests2 = _.map(ids2, (id) => Interests.findDoc(id));
    _.forEach(interests1, (interest1) => {
      _.forEach(interests2, (interest2) => {
        if (_.isEqual(interest1, interest2)) {
          matching.push(interest2);
        }
      });
    });
    return matching;
  }

  /**
   * Returns the matching user Interests for username and item.
   * @param {string} username the name of the user.
   * @param {IHasInterests} item the item with interestIDs.
   * @returns {IInterest[]}
   */
  public matchingUserInterests(username: string, item: IHasInterests) {
    const userInterestIDs = Users.getInterestIDsByType(username)[0];
    return this.matchingInterests(userInterestIDs, item.interestIDs);
  }

  /**
   * Returns the matching CareerGoal interests for username and item.
   * @param {string} username the name of the user.
   * @param {IHasInterests} item the item with interstIDs.
   * @returns {IInterest[]}
   */
  public matchingCareerGoalInterests(username: string, item: IHasInterests) {
    const userInterestIDs = Users.getInterestIDsByType(username)[1];
    return this.matchingInterests(userInterestIDs, item.interestIDs);
  }

  /**
   * Returns the Interests that don't match the user's interests.
   * @param {string} username the user.
   * @param {IHasInterests} item the item.
   * @returns {IInterest[]}
   */
  public notMatchingInterests(username: string, item: IHasInterests) {
    const userInterestIDs = Users.getInterestIDs(username);
    const matches = this.matchingInterests(userInterestIDs, item.interestIDs);
    const itemInterests = _.map(item.interestIDs, (id) => Interests.findDoc(id));
    return _.filter(itemInterests, (courseInterest) => {
      let ret = true;
      _.forEach(matches, (matchingInterest) => {
        if (_.isEqual(courseInterest, matchingInterest)) {
          ret = false;
        }
      });
      return ret;
    });
  }
}

export const MatchingInterests = new MatchingInterestsClass();
