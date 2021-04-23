import { SyncedCron } from 'meteor/littledata:synced-cron';
import { updateIceSnapshot } from '../../api/ice/IceSnapshot';
import { updateFactoids } from '../../api/factoid/Factoids';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { RadGradForecasts } from '../both/RadGradForecasts';

/**
 * Define all the cron jobs that run on the server.
 * These are kicked off in startup.ts.
 */

/** Disable logging. */
SyncedCron.config({ logger: (opts) => {} });

/** Define a schedule that runs every 24 hours at a time based on startup time. */
const every24Hours = (parser) => parser.text('every 24 hours');

SyncedCron.add({ name: 'Update ICE Snapshots', schedule: every24Hours, job: updateIceSnapshot });
SyncedCron.add({ name: 'Update Factoids', schedule: every24Hours, job: updateFactoids });
SyncedCron.add({ name: 'Update public stats', schedule: every24Hours, job: PublicStats.generateStats });
SyncedCron.add({ name: 'Update Forecasts', schedule: every24Hours, job: RadGradForecasts.updateForecasts });

