import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { defineTestFixtures } from '../test/test-utilities';
import { processStarCsvData, processBulkStarJsonData } from './StarProcessor';
import { Users } from '../user/UserCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('StarProcessor', function testSuite() {
    const starDataPath = 'database/star/StarSampleData-1.csv';
    const starJsonDataPath = 'database/star/BulkStarSampleData-1.json';
    const badStarJsonDataPath = 'database/star/StarBadSampleData.json';
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it.skip('#processStarCsvData', function test() {
      defineTestFixtures(['minimal', 'extended.courses.interests', 'abi.student']);
      const csvData = Assets.getText(starDataPath);
      const profile = Users.getProfile('abi@hawaii.edu');
      const courseInstanceDefinitions = processStarCsvData(profile.username, csvData);
      expect(courseInstanceDefinitions.length).to.equal(11);
      removeAllEntities();
    });

    it('#processBulkStarJsonData', function testJson() {
      defineTestFixtures(['minimal', 'extended.courses.interests', 'abi.student']);
      let jsonData = JSON.parse(Assets.getText(starJsonDataPath));
      const profile = Users.getProfile('abi@hawaii.edu');
      const bulkData = processBulkStarJsonData(jsonData);
      expect(bulkData[profile.username].courses.length).to.equal(12);
      expect(bulkData[profile.username].courses[0].grade).to.equal('A');
      jsonData = JSON.parse(Assets.getText(badStarJsonDataPath));
      const otherBulkData = processBulkStarJsonData(jsonData);
      expect(otherBulkData[profile.username].courses.length).to.equal(3);
      expect(otherBulkData[profile.username].courses[0].grade).to.equal('OTHER');
      removeAllEntities();
    });
  });
}
