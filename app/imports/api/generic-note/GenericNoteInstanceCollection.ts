import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { Slugs } from '../slug/SlugCollection';
import BaseSlugCollection from '../base/BaseSlugCollection';
import { StudentProfiles} from "../user/StudentProfileCollection";
import { AcademicTerms } from "../academic-term/AcademicTermCollection";
/**
 * Generic Note instance for students to use in the Degree Planner
 */

/**
 * Generic Note
 * - _.id (already provided)
 * - title (make text by default = 'title')
 * - body (make text by default = 'body')
 * - Academic Term
 * - student id
 * - slug
 */
class GenericNoteCollection extends BaseSlugCollection{

  constructor() {
    super('GenericNoteInstance', new SimpleSchema({
    }));
  }

}

//define
//update(id, title(opt), body(opt))
//dumpOne(id)

