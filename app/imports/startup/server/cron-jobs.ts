import { SyncedCron } from 'meteor/littledata:synced-cron';
import { notifications } from '../../api/notifications/Notifications';
import { userInteractionManager } from '../../api/user-interaction/UserInteractionManager';
import { updateFactoids } from '../../api/factoid/Factoids';
import { PublicStats } from '../../api/public-stats/PublicStatsCollection';
import { whatsNew } from '../../api/whats-new/WhatsNew';
import { RadGradForecasts } from '../both/RadGradForecasts';
import { updateAllStudentLevelsCron } from '../../api/level/LevelProcessor';

/**
 * Define all the cron jobs that run on the server.
 * These are kicked off in startup.ts.
 */

/** Disable logging. */
SyncedCron.config({ logger: (opts) => {} });

// To simplify things, let's give everyone their own minute to run in.
const beforeMidnight = (parser) => parser.text('at 11:55 pm');
const afterMidnight = (parser) => parser.text('at 12:05 am');
const afterMidnight2 = (parser) => parser.text('at 12:06 am');
const afterMidnight3 = (parser) => parser.text('at 12:07 am');
const afterMidnight4 = (parser) => parser.text('at 12:08 am');
const afterMidnight5 = (parser) => parser.text('at 12:09 am');
const atSixAM = (parser) => parser.text('at 6:00 am');

// Useful for debugging
// const every15seconds = (parser) => parser.text('every 15 seconds');
// const every24Hours = (parser) => parser.text('every 24 hours');

SyncedCron.add({ name: 'Update User Interactions', schedule: beforeMidnight, job: () => userInteractionManager.dailyUpdate() });
SyncedCron.add({ name: 'Update Factoids', schedule: afterMidnight, job: updateFactoids });
SyncedCron.add({ name: 'Update Public Stats', schedule: afterMidnight2, job: PublicStats.generateStats });
SyncedCron.add({ name: 'Update Forecasts', schedule: afterMidnight3, job: () => RadGradForecasts.updateForecasts() });
SyncedCron.add({ name: 'Update Whats New', schedule: afterMidnight4, job: () => whatsNew.updateData() });
SyncedCron.add({ name: 'Update All Student Levels', schedule: afterMidnight5, job: () => updateAllStudentLevelsCron() });
SyncedCron.add({ name: 'Notification Emails', schedule: atSixAM, job: () => notifications.run() });
