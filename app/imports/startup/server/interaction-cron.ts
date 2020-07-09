import _ from 'lodash';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import moment from 'moment';
import { IceSnapshots } from '../../api/analytic/IceSnapshotCollection';
import { StudentProfiles } from '../../api/user/StudentProfileCollection';
import { UserInteractions } from '../../api/analytic/UserInteractionCollection';
import {
  IIceSnapshotDefine,
  IPageInterest,
  IPageInterestInfo,
} from '../../typings/radgrad';
import { UserInteractionsTypes } from '../../api/analytic/UserInteractionsTypes';
import { PageInterestsDailySnapshots } from '../../api/page-tracking/PageInterestsDailySnapshotCollection';
import { PageInterests } from '../../api/page-tracking/PageInterestCollection';
import { PageInterestsCategoryTypes } from '../../api/page-tracking/PageInterestsCategoryTypes';

function createIceSnapshot(doc) {
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
              // @ts-ignore
              UserInteractions.define({
                username,
                type: UserInteractionsTypes.COMPLETEPLAN,
                typeData: [ice.i.toString(), ice.c.toString(), ice.e.toString()],
              });
            }
          }
        }
      }
    });
  },
});

function createDailySnapshot(pageInterests: IPageInterest[]) {
  interface snapshotDoc {
    careerGoals: IPageInterestInfo[];
    courses: IPageInterestInfo[];
    interests: IPageInterestInfo[];
    opportunities: IPageInterestInfo[];
  }

  const doc: snapshotDoc = { careerGoals: [], courses: [], interests: [], opportunities: [] };
  const found = { careerGoals: [], courses: [], interests: [], opportunities: [] };
  pageInterests.forEach((pageInterest: IPageInterest) => {
    const objectInstance: IPageInterestInfo = { name: pageInterest.name, views: 0 };
    // If we have not yet discovered the first instance of a page interest for that area,
    // we push it to its corresponding array in the found object
    if (pageInterest.category === PageInterestsCategoryTypes.CAREERGOAL && found.careerGoals.indexOf(pageInterest.name) === -1) {
      found.careerGoals.push(pageInterest.name);
      objectInstance.views = 1;
      doc.careerGoals.push(objectInstance);
    } else if (pageInterest.category === PageInterestsCategoryTypes.COURSE && found.courses.indexOf(pageInterest.name) === -1) {
      found.courses.push(pageInterest.name);
      objectInstance.views = 1;
      doc.courses.push(objectInstance);
    } else if (pageInterest.category === PageInterestsCategoryTypes.INTEREST && found.interests.indexOf(pageInterest.name) === -1) {
      found.interests.push(pageInterest.name);
      objectInstance.views = 1;
      doc.interests.push(objectInstance);
    } else if (pageInterest.category === PageInterestsCategoryTypes.OPPORTUNITY && found.opportunities.indexOf(pageInterest.name) === -1) {
      found.opportunities.push(pageInterest.name);
      objectInstance.views = 1;
      doc.opportunities.push(objectInstance);
    } else {
      // Otherwise, just increment the existing value in doc array
      switch (pageInterest.category) {
        case PageInterestsCategoryTypes.CAREERGOAL:
          doc.careerGoals.filter((careerGoal) => careerGoal.name === pageInterest.name)[0].views++;
          break;
        case PageInterestsCategoryTypes.COURSE:
          doc.courses.filter((course) => course.name === pageInterest.name)[0].views++;
          break;
        case PageInterestsCategoryTypes.INTEREST:
          doc.interests.filter((interest) => interest.name === pageInterest.name)[0].views++;
          break;
        case PageInterestsCategoryTypes.OPPORTUNITY:
          doc.opportunities.filter((opportunity) => opportunity.name === pageInterest.name)[0].views++;
          break;
        default:
          console.error(`Bad pageInterest.category: ${pageInterest.category}`);
          break;
      }
    }
  });
  PageInterestsDailySnapshots.define({
    careerGoals: doc.careerGoals,
    courses: doc.courses,
    interests: doc.interests,
    opportunities: doc.opportunities,
  });
}

SyncedCron.add({
  name: 'Create PageInterests Daily Snapshot',
  schedule(parser) {
    return parser.text('every 24 hours');
  },
  job() {
    // If we currently do not have any daily snapshots, initialize the first snapshot
    if (PageInterestsDailySnapshots.find({}).count() === 0) {
      createDailySnapshot(PageInterests.find({}).fetch());
    } else {
      // const recentSnapshot: IPageInterestsDailySnapshot = PageInterestsDailySnapshots.findOne({}, { sort: { timestamp: -1 } });
      // FIXME https://github.com/radgrad/radgrad2/issues/138#issuecomment-640179173 See edge cases
      const gte = moment().subtract(1, 'day').startOf('day').toDate();
      const lte = moment().subtract(1, 'day').endOf('day').toDate();
      const pageInterestsSinceRecentSnapshot = PageInterests.find({ timestamp: { $gte: gte, $lte: lte } }).fetch();
      createDailySnapshot(pageInterestsSinceRecentSnapshot);
    }
  },
});
