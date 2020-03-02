import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { StudentProfiles} from "../user/StudentProfileCollection";
import { AcademicTerms } from "../academic-term/AcademicTermCollection";
import BaseCollection from "../base/BaseCollection";
import { IGenericNoteInstanceDefine, IGenericNoteInstanceUpdate } from "../../typings/radgrad";
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

  /**
   * Defines a new Generic Note Instance
   * @param {Object} object with title, body, academicTerm, student and retired
   * Required fields: academicterm, student
   * Sets the title to 'Title' and body to 'Body'
   * @throws {Meteor.Error} If the definition includes course of student
   * @return a new docID
   */

  public define({ title = 'Title', body = 'Body', academicTerm, student, retired=false, }: IGenericNoteInstanceDefine){

    if(AcademicTerms.isDefined(academicTerm) == false){
      throw new Meteor.Error('academic term is not defined');
    }

    if (StudentProfiles.isDefined(student) == false){
      throw new Meteor.Error('Student not defined.');
    }

   return this.collection.insert({
     title,
     body,
     academicTerm,
     student,
     retired,
   });
  }

  /**
   * Used for when any update to the note takes place
   * @param docID required the string that references the document
   * @param title
   * @param body
   * @param academicTerm
   * @param student
   */
  public update(docID: string, {title, body, academicTerm, student, retired}: IGenericNoteInstanceDefine){

    this.assertDefined(docID);
    const updateData: IGenericNoteInstanceUpdate = {};
    if(title){
      updateData.title = title;
    }
    if(body){
      updateData.body = body;
    }
    if(academicTerm){
      updateData.academicTerm = academicTerm;
    }
    if(student){
      updateData.student = student;
    }
    if(_.isBoolean(retired)){
      updateData.retired = retired;
    }

  }

  /**
   * If the student wants to remove the note
   * @param docID the docID of the generic note instance
   */
  public removeIt(docID: string){
    this.assertDefined(docID);
    // now it's ok to delete
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
   * Integrity Check
   * checks if there are any problems with the things the note instance references
   * Checks studentID, academicID
   * @returns array of strings with integrity issues
   * if the array is empty, it means no problems were found
   */
  public checkIntegrity(){
    //check if student and academicTerm is defined
    const problems = [];
    this.find().forEach( (doc) => {
      if(!AcademicTerms.isDefined(doc.termID)){
        problems.push(`Bad termID: ${doc.termID}`);
      }
      if(!StudentProfiles.isDefined(doc.studentID)){
        problems.push(`Bad studentID ${doc.studentID}`);
      }
    });
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

/**
 * Provide the singleton instance of this class to all other entities
 * @memberOf api/generic-note
 */
export const GenericNoteInstances = new GenericNoteInstanceCollection();



