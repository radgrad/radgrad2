import './initialize-db';
import './publications';
import './cron-jobs';
import '../both/RadGradForecasts';
import '../../api/base/BaseCollection.methods';
import '../../api/course/CourseCollection.methods';
import '../../api/email/Email.methods';
import '../../api/integrity/IntegrityChecker.methods';
import '../../api/internship/InternshipCollection.methods';
import '../../api/level/LevelProcessor.methods';
import '../../api/star/StarProcessor.methods';
import '../../api/user/BaseProfileCollection.methods';
import '../../api/user/StudentProfileCollection.methods';
import '../../api/user/UserCollection.methods';
import '../../api/user/profile-entries/ProfileAssociatedUsers.methods';
import '../../api/user/profile-entries/ProfileEntries.methods';
import '../../api/user/profile-entries/ProfileOpportunityCollection.methods';
import '../../api/user-interaction/UserInteractionCollection.methods';
import '../../api/utilities/FutureEnrollment.methods';
import '../../api/utilities/InterestConversion.methods'; // TODO: This might not be needed any more
import '../../api/utilities/MostPopular.methods';
import '../../api/utilities/TermsAndConditions.methods';
import '../../api/verification/VerificationRequestCollection.methods';
import '../../api/whats-new/WhatsNew.methods';

import './startup'; // load this last
