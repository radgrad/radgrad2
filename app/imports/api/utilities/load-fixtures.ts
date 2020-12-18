import _ from 'lodash';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { UserInteractions } from '../analytic/UserInteractionCollection';
import BaseCollection from '../base/BaseCollection';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { Slugs } from '../slug/SlugCollection';
import { getDefinitions } from '../test/test-utilities';
import { Users } from '../user/UserCollection';
import { AdvisorProfiles } from '../user/AdvisorProfileCollection';
import { FacultyProfiles } from '../user/FacultyProfileCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { HelpMessages } from '../help/HelpMessageCollection';
import { AdvisorLogs } from '../log/AdvisorLogCollection';

export const loadCollectionNewDataOnly = (collection: BaseCollection, loadJSON, printToConsole) => {
  let retVal = '';
  // console.log('loadCollectionNewDataOnly', loadJSON, printToConsole, typeof collection);
  const type = collection.getType();
  const definitions = getDefinitions(loadJSON, collection.getCollectionName());
  let count = 0;
  _.forEach(definitions, (definition) => {
    let studentID;
    let termID;
    switch (type) {
      case UserInteractions.getType():
        if (UserInteractions.find({
          username: definition.username,
          type: definition.type,
          typeData: definition.typeData,
          timestamp: definition.timestamp,
        }).count() === 0) {
          collection.define(definition);
          count++;
        }
        break;
      case CourseInstances.getType():
        // console.log(definition.student);
        // eslint-disable-next-line no-case-declarations
        termID = AcademicTerms.getID(definition.academicTerm);
        // eslint-disable-next-line no-case-declarations
        const courseID = Courses.getID(definition.course);
        // eslint-disable-next-line no-case-declarations
        studentID = Users.getID(definition.student);
        if (CourseInstances.find({ termID, courseID, studentID }).count() === 0) {
          collection.define(definition);
          count++;
        }
        break;
      case AcademicYearInstances.getType(): {
        studentID = Users.getID(definition.student);
        if (AcademicYearInstances.find({ year: definition.year, studentID })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
      }
        break;
      case Feeds.getType():
        if (Feeds.find({
          feedType: definition.feedType,
          description: definition.description,
          timestamp: definition.timestamp,
        }).count() === 0) {
          collection.define(definition);
          count++;
        }
        break;
      case FeedbackInstances.getType(): {
        const userID = Users.getID(definition.user);
        if (FeedbackInstances.find({
          userID,
          functionName: definition.functionName,
          description: definition.description,
          feedbackType: definition.feedbackType,
        })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
      }
        break;
      case HelpMessages.getType():
        if (HelpMessages.find({ routeName: definition.routeName })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
        break;
      case AdvisorLogs.getType(): {
        const advisorID = Users.getID(definition.advisor);
        studentID = Users.getID(definition.student);
        if (AdvisorLogs.find({
          advisorID, studentID, text: definition.text, createdOn: definition.createdOn,
        })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
      }
        break;
      case OpportunityInstances.getType():
        termID = AcademicTerms.getID(definition.academicTerm);
        studentID = Users.getID(definition.student);
        // eslint-disable-next-line no-case-declarations
        const opportunityID = Opportunities.getID(definition.opportunity);
        if (OpportunityInstances.find({ termID, studentID, opportunityID }).count() === 0) {
          collection.define(definition);
        }
        break;
      case AdvisorProfiles.getType():
      case FacultyProfiles.getType():
      case StudentProfiles.getType():
        if (collection.find({ username: definition.username })
          .count() === 0) {
          collection.define(definition);
          count++;
        }
        break;
      default: // Slug collections
        if ('slug' in definition) {
          if (!Slugs.isDefined(definition.slug)) {
            collection.define(definition);
            count++;
          }
        }
    }
  });
  if (count > 1) {
    retVal += `Defined ${count} ${type}s`;
  } else if (count === 1) {
    retVal += `Defined a ${type}`;
  }
  return retVal;
};
