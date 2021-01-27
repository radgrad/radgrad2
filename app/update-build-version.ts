const replace = require('replace-in-file');
const moment = require('moment');
const pack = require('./package.json');
const buildVersion = pack.version;
const bugFixStr = moment().format('MM/DD/YY');
const optionsVersion = {
  files: 'imports/build-version.ts',
  from: /version: '(.*)'/g,
  to: "version: '" + buildVersion + "'",
  allowEmptyPaths: false,
};

const optionsBugFix = {
  files: 'imports/build-version.ts',
  from: /bugFix: '(.*)'/g,
  to: "bugFix: '" + bugFixStr + "'",
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(optionsVersion);
  if (changedFiles == 0) {
    throw "Please make sure that file '" + optionsVersion.files + "' has \"version: ''\"";
  }
  console.log('Build version set: ' + buildVersion);
  changedFiles = replace.sync(optionsBugFix);
  if (changedFiles == 0) {
    throw "Please make sure that file '" + optionsVersion.files + "' has \"bugFix: ''\"";
  }
  console.log('bugFix set: ' + bugFixStr);
} catch (error) {
  console.error('Error occurred:', error);
  throw error;
}
