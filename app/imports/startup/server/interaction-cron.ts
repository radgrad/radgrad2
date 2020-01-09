import _ from 'lodash';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import moment from 'moment';
import { IceSnapshots } from '../../api/analytic/IceSnapshotCollection';
import { StudentProfiles } from '../../api/user/StudentProfileCollection';
import { UserInteractions } from '../../api/analytic/UserInteractionCollection';
import { IIceSnapshotDefine } from '../../typings/radgrad'; // eslint-disable-line

function createSnapshot(doc) {
  const ice = StudentProfiles.getProjectedICE(doc.username);
  const snapshotData: IIceSnapshotDefine = {
    username: doc.username,
    level: doc.level,
    i: ice.i,
    c: ice.c,
    e: ice.e,
    updated: moment().toDate(),
  };
  console.log('Creating snapshot for: ', doc.username);
  IceSnapshots.define(snapshotData);
}

/**
 * Adds a cron job which creates or updates a student's Ice Snapshot. This is used to determine
 * if a student has leveled up and/or achieved 100 ICE points, and if so, creates a User Interaction
 * representing the objective that was completed.
 */
SyncedCron.add({
  name: 'Create/update Ice Snapshot for each student',
  schedule(parser) {
    // parser is a later.parse object
    return parser.text('every 24 hours');
  },
  job() {
    _.each(StudentProfiles.find().fetch(), (doc) => {
      const iceSnap = IceSnapshots.findOne({ username: doc.username });
      const username = doc.username;
      const level = doc.level;
      if (iceSnap === undefined) {
        createSnapshot(doc);
      } else {
        if (level !== iceSnap.level) {
          console.log('Updating snapshot for user: ', username);
          IceSnapshots.getCollection().update({ username }, { $set: { level, updated: moment().toDate() } });
          if (level > iceSnap.level) {
            UserInteractions.define({ username, type: 'level', typeData: [level] });
          }
        }
        const ice = StudentProfiles.getProjectedICE(doc.username);
        if ((iceSnap.i !== ice.i) || (iceSnap.c !== ice.c) || (iceSnap.e !== ice.e)) {
          console.log('Updating snapshot for user: ', username);
          IceSnapshots.getCollection().update({ username }, { $set: { i: ice.i, c: ice.c, e: ice.e, updated: moment().toDate() } });
          if ((iceSnap.i < 100) || (iceSnap.co < 100) || (iceSnap.e < 100)) {
            if ((ice.i > 100) && (ice.c > 100) && (ice.e > 100)) {
              // @ts-ignore
              UserInteractions.define({ username, type: 'completePlan', typeData: [ice.i, ice.c, ice.e] });
            }
          }
        }
      }
    });
  },
});
