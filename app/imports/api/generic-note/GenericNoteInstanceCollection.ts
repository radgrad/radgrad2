import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { StudentProfiles} from "../user/StudentProfileCollection";
import { AcademicTerms } from "../academic-term/AcademicTermCollection";
import BaseCollection from "../base/BaseCollection";
import {IGenericNoteInstanceDefine} from "../../typings/radgrad";

/**
 * Generic Note instance for students to use in the Degree Planner
 */

/**
 * Generic Note Instance
 * - _.id (already provided)
 * - title (make text by default = 'title')
 * - body (make text by default = 'body')
 * - Academic TermID
 * - studentID
 * - Retired
 */
class GenericNoteInstanceCollection extends BaseCollection{

  constructor() {
    super('GenericNoteInstance', new SimpleSchema({
      title: { type: String },
      body: { type: String },
      AcademicTermID: { type: String },
      studentID: { type: String },
      retired: {type: Boolean, optional: true }
    }));
  }
  public define({title = "Title", body = "Body", AcademicTermID, studentID, retired = false} : IGenericNoteInstanceDefine){

  }
}

//define()
//update(id, title(opt), body(opt))
//dumpOne(id)
//removeIt()
//checkIntegrity()
//getName()


