import { Meteor } from 'meteor/meteor';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { processVerificationEventMethod } from './VerificationRequestCollection.methods';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('VerificationRequestCollection Meteor Methods ', function test() {
    before(function b(done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student', 'opportunities'], done);
    });

    it('ProcessVerificationEvent Method', async function processVerification(done) {
      try {
        await withLoggedInUser();
        await withRadGradSubscriptions();
        const student = 'abi@hawaii.edu';
        const opportunity = 'acm-icpc';
        const academicTerm = AcademicTerms.getAcademicTerm(new Date('2016-11-18T00:00:00.000Z'));
        await processVerificationEventMethod.callPromise({ student, opportunity, academicTerm });
        done();
      } catch (e) {
        done(e);
      }
    });
  });
}
