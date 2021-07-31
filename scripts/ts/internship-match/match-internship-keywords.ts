import { program } from 'commander';
import * as fs from 'fs';
import { InternshipDefine } from '../fixture-generator/internship-utilities';

export const matchKeywords = (keywords: string[], internship: InternshipDefine): string[] => keywords.filter((word) => internship.description.includes(word));

async function matchInternshipsAndKeywords(keywordFileName, internshipFileName) {
  console.log('matchInternshipsAndKeywords', keywordFileName, internshipFileName);
  const keywordData = fs.readFileSync(keywordFileName);
  const keywords = JSON.parse(keywordData.toString());
  const internshipData = fs.readFileSync(internshipFileName);
  const internships = JSON.parse(internshipData.toString());
  console.log(keywords.length, internships.length);
  internships.forEach(i => console.log(matchKeywords(keywords, i)));
}

program
  .arguments('<keywordFileName> <internshipFileName>')
  .description('Matches the keywords to the internships', {
    keywordsFileName: 'The name of the keywords file. A JSON file with an array of keywords.',
    internshipFileName: 'The name of the internships file. A JSON file with an array of canonical internships.',
  })
  .action((keywordFileName, internshipFileName) => matchInternshipsAndKeywords(keywordFileName, internshipFileName));

program.parse(process.argv);
