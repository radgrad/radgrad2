import { SyncedCron } from 'meteor/littledata:synced-cron';
import { userInteractionManager } from '../../api/analytic/UserInteractionManager';
import { updateIceSnapshot } from '../../api/ice/IceSnapshot';
import { updateFactoids } from '../../api/factoid/Factoids';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { whatsNew } from '../../api/whats-new/WhatsNew';
import { RadGradForecasts } from '../both/RadGradForecasts';

/**
 * Define all the cron jobs that run on the server.
 * These are kicked off in startup.ts.
 */

/** Disable logging. */
SyncedCron.config({ logger: (opts) => {} });

/** Define a schedule that runs every 24 hours at a time based on startup time. */
const every24Hours = (parser) => parser.text('every 24 hours');
const afterMidnight = (parser) => parser.text('at 12:05 am');
const beforeMidnight = (parser) => parser.text('at 11:55 pm');

SyncedCron.add({ name: 'Update ICE Snapshots', schedule: every24Hours, job: updateIceSnapshot });
SyncedCron.add({ name: 'Update Factoids', schedule: every24Hours, job: updateFactoids });
SyncedCron.add({ name: 'Update public stats', schedule: afterMidnight, job: PublicStats.generateStats });
SyncedCron.add({ name: 'Update Forecasts', schedule: afterMidnight, job: RadGradForecasts.updateForecasts });
SyncedCron.add({ name: 'Update Whats New', schedule: afterMidnight, job: whatsNew.updateData });
SyncedCron.add({ name: 'Update User Interactions', schedule: beforeMidnight, job: userInteractionManager.updateData });

