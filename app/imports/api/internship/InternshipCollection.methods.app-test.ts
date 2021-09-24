import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { defineTestFixturesMethod, withLoggedInUser } from '../test/test-utilities';
import { InternAlohaUrlsEnum } from './import/InternAlohaUrls';
import { getInternAlohaInternshipsMethod } from './InternshipCollection.methods';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('InternshipCollection Meteor Methods ', function test() {
    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student'], done);
    });

    it('Get raw internship ziprecruiter', async function () {
      await withLoggedInUser();
      const results = await getInternAlohaInternshipsMethod.callPromise({ url: InternAlohaUrlsEnum.ziprecruiter });
      expect(results.length).to.be.above(-1);
      // console.log(results);
      // results.forEach((result) => processCanonical(result));
      // processCanonical(results[0]);
    });

    it('Get raw internship linkedin', async function () {
      await withLoggedInUser();
      const results = await getInternAlohaInternshipsMethod.callPromise({ url: InternAlohaUrlsEnum.linkedin });
      expect(results.length).to.be.above(-1);
      // console.log(results);
    });
  });
}
