import { SyncedCron } from 'meteor/littledata:synced-cron';
import { Meteor } from 'meteor/meteor';
import { updateIceSnapshot } from '../../api/ice/IceSnapshot';
import { updateFactoids } from '../../api/factoid/factoids';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';

SyncedCron.add({
  name: 'Update ICE Snapshots',
  schedule: (parser) => parser.text('every 24 hours'),
  job: () => updateIceSnapshot(),
});

SyncedCron.add({
  name: 'Update Factoids',
  schedule: (parser) => parser.text('every 24 hours'),
  job: () => updateFactoids(),
});

SyncedCron.add({
  name: 'Update public stats',
  schedule: (parser) => parser.text('every 24 hours'),
  job: () => PublicStats.generateStats(),
});

Meteor.startup(() => {
  SyncedCron.start();
});
