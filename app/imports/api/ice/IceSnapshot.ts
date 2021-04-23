import moment from 'moment';
import { IceSnapshotDefine } from '../../typings/radgrad';
import { IceSnapshots } from '../analytic/IceSnapshotCollection';
import { UserInteractions } from '../analytic/UserInteractionCollection';
import { UserInteractionsTypes } from '../analytic/UserInteractionsTypes';
import { StudentProfiles } from '../user/StudentProfileCollection';

/**
 * ICE Snapshots are used to determine if a user has completed their degree plan in the last day.
 * If so, then a UserInteraction document is created to record that behavior.
 */

const createIceSnapshot = (doc) => {
  const ice = StudentProfiles.getProjectedICE(doc.username);
  const snapshotData: IceSnapshotDefine = {
    username: doc.username,
    level: doc.level,
    i: ice.i,
    c: ice.c,
    e: ice.e,
    updated: moment().toDate(),
  };
  console.log('Creating snapshot for: ', doc.username);
  IceSnapshots.define(snapshotData);
};

export const updateIceSnapshot = () => {
  StudentProfiles.find().fetch().forEach((doc) => {
    const iceSnap = IceSnapshots.findOne({ username: doc.username });
    const username = doc.username;
    const level = doc.level;
    if (iceSnap === undefined) {
      createIceSnapshot(doc);
    } else {
      if (level !== iceSnap.level) {
        console.log('Updating snapshot for user: ', username);
        IceSnapshots.getCollection().update({ username }, { $set: { level, updated: moment().toDate() } });
        if (level > iceSnap.level) {
          UserInteractions.define({ username, type: UserInteractionsTypes.LEVEL, typeData: [level] });
        }
      }
      const ice: { i: number, c: number, e: number } = StudentProfiles.getProjectedICE(doc.username);
      if ((iceSnap.i !== ice.i) || (iceSnap.c !== ice.c) || (iceSnap.e !== ice.e)) {
        console.log('Updating snapshot for user: ', username);
        IceSnapshots.getCollection().update({ username }, {
          $set: {
            i: ice.i,
            c: ice.c,
            e: ice.e,
            updated: moment().toDate(),
          },
        });
        if ((iceSnap.i < 100) || (iceSnap.c < 100) || (iceSnap.e < 100)) {
          if ((ice.i > 100) && (ice.c > 100) && (ice.e > 100)) {
            UserInteractions.define({
              username,
              type: UserInteractionsTypes.COMPLETE_PLAN,
              typeData: [ice.i.toString(), ice.c.toString(), ice.e.toString()],
            });
          }
        }
      }
    }
  });
};
