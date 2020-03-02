import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import 'mocha';
import { GenericNoteInstances } from "./GenericNoteInstanceCollection";
import { makeSampleUser } from '../user/SampleUsers';
import { makeSampleAcademicTerm} from "../academic-term/SampleAcademicTerms";
import { makeRandomTitle, makeRandomBody} from "./SampleGenericNoteInstance";
// import { IGenericNoteInstance } from "../../typings/radgrad";
import { Users } from "../user/UserCollection";
import { AcademicTerms } from "../academic-term/AcademicTermCollection";
import { removeAllEntities } from "../base/BaseUtilities";

if(Meteor.isServer){
  describe('GenericNoteInstanceCollection', function testSuite() {

    before(function setup(){
      this.timeout(5000);
      removeAllEntities();
    });

    after(function teardown(){
      removeAllEntities();
    });

    it( 'Can define and removeIt', function test1(done){
      this.timeout(5000);
    })
  });
}
