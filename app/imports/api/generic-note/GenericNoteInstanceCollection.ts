import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { StudentProfiles} from "../user/StudentProfileCollection";
import { AcademicTerms } from "../academic-term/AcademicTermCollection";
import BaseCollection from "../base/BaseCollection";
import { IGenericNoteInstanceDefine } from "../../typings/radgrad";
import { AcademicYearInstances } from "../degree-plan/AcademicYearInstanceCollection";
import { Users } from "../user/UserCollection";

/**
 * Generic Note instance collection for students to use in the Degree Planner
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
      title: String,
      body: String,
      academicTerm: String,
      student: String,
      retired: {type: Boolean, optional: true },
    }));
    this.defineSchema = new SimpleSchema({
      title: String,
      body: String,
      academicTerm: String,
      student: String,
      retired: { Boolean, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      title: { type: String, optional: true },
      body: { type: String, optional: true },
      academicTerm: { type: String, optional: true },
      student: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
  }

  public define({ title = 'Title', body = 'Body', academicTerm, student, retired=false, }: IGenericNoteInstanceDefine){
    /**
     * things I need to check for:
     *  - is academicTerm defined?
     *    - if it's not, throw new Meteor.Error();
     *  - is student defined?
     *    - if it's not, throw new Meteor.Error();
     */

   return this.collection.insert({
     title,
     body,
     academicTerm,
     student,
     retired,
   });
  }

  /**
   * If a student wants to change the title or body
   */
  public updateText(){
  }

  /**
   * If the student wants to move the note to another term
   */
  public updateTerm(){

  }

  /**
   * If the student wants to remove the note
   * @param docID the docID of the generic note instance
   */
  public removeIt(docID: string){
    // ask Cam what assert defined is doing here
    this.assertDefined(docID);
    // now its ok to delete?
    return super.removeIt(docID);
  }

  /**
   *
   * @param studentID studentID in the doc
   * @returns the Student's name
   */
  public getStudentName(studentID){
    const name = StudentProfiles.findDoc(studentID).name;
    return name;
  }

  /**
   * What is this for?
   */
  public checkIntegrity(){
    const problems = [];
    return problems;
  }

  /**
   * Dump One returns an object representing the GenericNoteInstance docID in format acceptable to define()
   * @param docID
   * @returns { Object } An object representing the definition of a docID
   */
  public dumpOne(docID: string): IGenericNoteInstanceDefine {
    const doc = this.findDoc(docID);
    const title = '';
    const body = '';
    const academicTerm = AcademicTerms.findSlugByID(doc.termID);
    const student = Users.getProfile(doc.studentID).username;
    const retired = doc.retired;
    return {title, body, academicTerm, student, retired};
  }

}


export const GenericNoteInstance = new GenericNoteInstanceCollection();



