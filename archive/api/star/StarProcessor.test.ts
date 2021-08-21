
it.skip('#processStarCsvData', function test() {
  defineTestFixtures(['minimal', 'extended.courses.interests', 'abi.student']);
  const csvData = Assets.getText(starDataPath);
  const profile = Users.getProfile('abi@hawaii.edu');
  const courseInstanceDefinitions = processStarCsvData(profile.username, csvData);
  expect(courseInstanceDefinitions.length).to.equal(11);
  removeAllEntities();
});

