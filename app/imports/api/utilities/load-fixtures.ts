import _ from 'lodash';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { UserInteractions } from '../analytic/UserInteractionCollection';
import BaseCollection from '../base/BaseCollection';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { Slugs } from '../slug/SlugCollection';
import { getDefinitions } from '../test/test-utilities';
import { Users } from '../user/UserCollection';

export const loadCollectionNewDataOnly = (collection: BaseCollection, loadJSON, printToConsole) => {
  let retVal = '';
  // console.log('loadCollectionNewDataOnly', loadJSON, printToConsole, typeof collection);
  const type = collection.getType();
  const definitions = getDefinitions(loadJSON, collection.getCollectionName());
  let count = 0;
  _.forEach(definitions, (definition) => {
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
        // eslint-disable-next-line no-case-declarations
        const termID = AcademicTerms.getID(definition.academicTerm);
        // eslint-disable-next-line no-case-declarations
        const courseID = Courses.getID(definition.course);
        // eslint-disable-next-line no-case-declarations
        const studentID = Users.getID(definition.student);
        if (CourseInstances.find({ termID, courseID, studentID }).count() === 0) {
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
  console.log(count);
  if (count > 1) {
    retVal += `Defined ${count} ${type}s`;
  } else if (count === 1) {
    retVal += `Defined a ${type}`;
  }
  console.log(retVal);
  return retVal;
};
