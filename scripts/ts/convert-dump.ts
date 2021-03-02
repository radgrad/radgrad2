import * as fs from 'fs';
// import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import moment from 'moment';
import { program } from 'commander';
import { getCollectionData, getCollectionDocFromSlug } from './data-dump-utils';

interface ICollection {
  name: string;
  contents: any[];
}

interface IDataDump {
  timestamp: string;
  collections: ICollection[];
}

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

let radGrad1DataDump: IDataDump;

const convertObject = (item) => {
  const result: any = {};
  for (const key in item) { // eslint-disable-line
    // console.log(key);
    switch (key) {
      case 'coursesPerSemester':
        result.coursesPerAcademicTerm = item[key];
        break;
      case 'courseList':
        result.choiceList = item[key];
        break;
      case 'declaredSemester':
        result.declaredAcademicTerm = item[key];
        break;
      case 'number':
        result.num = item[key];
        break;
      case 'semester':
        result.academicTerm = item[key];
        break;
      case 'semesters':
        result.academicTerms = item[key];
        break;
      case 'favoriteCourses':
        result.profileCourses = item[key];
        break;
      case 'favoriteOpportunities':
        result.profileOpportunities = item[key];
        break;
      default:
        result[key] = item[key];
    }
  }
  // console.log(result);
  return result;
};

const fixRelativeLinks = (description: string): string => {
  let fixed = description.replace(/..\/courses/gi, '/explorer/courses');
  fixed = fixed.replace(/..\/opportunities/gi, '/explorer/opportunities');
  fixed = fixed.replace(/data-scientist/g, '/explorer/career-goals/data-scientist');
  fixed = fixed.replace(/graduate-school/g, '/explorer/career-goals/graduate-school');
  fixed = fixed.replace(/mobile-app-developer/g, '/explorer/career-goals/mobile-app-developer');
  fixed = fixed.replace(/game-developer/g, '/explorer/career-goals/game-developer');
  fixed = fixed.replace(/full-stack-developer/g, '/explorer/career-goals/full-stack-developer');
  fixed = fixed.replace(/vr-ar-engineer/g, '/explorer/career-goals/vr-ar-engineer');
  fixed = fixed.replace(/hhttp/g, 'http');
  fixed = fixed.replace(/ics(\d{3})/g, 'ics_' + '$1'); // eslint-disable-line no-useless-concat
  return fixed;
};

const convertCareerGoal = (goal) => {
  const result: any = {};
  for (const key in goal) { // eslint-disable-line no-restricted-syntax
    if (key === 'description') {
      result.description = fixRelativeLinks(goal.description);
    } else {
      result[key] = goal[key];
    }
  }
  return result;
};

const convertProfileInterestCareerGoal = (profileInterest) => {
  const result: any = {};
  for (const key in profileInterest) { // eslint-disable-line no-restricted-syntax
    if (key === 'student') {
      result.username = profileInterest.student;
    } else {
      result[key] = profileInterest[key];
    }
  }
  return result;
};

const convertProfile = (profile, data) => {
  const result: any = {};
  for (const key in profile) { // eslint-disable-line no-restricted-syntax
    if (key === 'picture') {
      result.picture = profile.picture.replace(/http:\/\/res.cloudinary.com/g, 'https://res.cloudinary.com');
    } else if (key === 'interests') {
      let interests = profile.interests;
      const careerGoalCollection = getCollectionData(data, 'CareerGoalCollection');
      const favoriteCareerGoalCollection = getCollectionData(data, 'FavoriteCareerGoalCollection');
      const profileFavoriteCareerGoals = _.filter(favoriteCareerGoalCollection, (entry) => entry.username === profile.username);
      const profileCareerGoalSlugs = profileFavoriteCareerGoals.map((fav) => fav.careerGoal);
      const profileCareerGoals = profileCareerGoalSlugs.map((slug) => getCollectionDocFromSlug(careerGoalCollection, slug));
      profileCareerGoals.forEach((careerGoal) => {
        interests = _.union(interests, careerGoal.interests);
      });
      result[key] = _.uniq(interests);
    } else {
      result[key] = profile[key];
    }
  }
  return result;
};

const processRadGradCollection = (collection: ICollection) => {
  const result: any = {};
  // console.log(collection.name/* , collection.contents */);
  if (collection.name === 'SemesterCollection') {
    result.name = 'AcademicTermCollection';
    result.contents = collection.contents;
    // console.log(result);
  } else if (collection.name === 'CareerGoalCollection') {
    result.name = collection.name;
    result.contents = _.map(collection.contents, convertCareerGoal);
  } else if (collection.name === 'StudentProfileCollection' || collection.name === 'AdvisorProfileCollection' || collection.name === 'FacultyProfileCollection') {
    result.name = collection.name;
    result.contents = _.map(collection.contents, (profile) => convertProfile(profile, radGrad1DataDump));
  } else if (collection.name === 'FavoriteCareerGoalCollection') {
    result.name = 'ProfileCareerGoalCollection';
    result.contents = collection.contents.map(convertProfileInterestCareerGoal);
  } else if (collection.name === 'FavoriteCourseCollection') {
    result.name = 'ProfileCourseCollection';
    result.contents = collection.contents.map(convertObject);
  } else if (collection.name === 'FavoriteInterestCollection') {
    result.name = 'ProfileInterestCollection';
    result.contents = collection.contents.map(convertProfileInterestCareerGoal);
  } else if (collection.name === 'FavoriteOpportunityCollection') {
    result.name = 'ProfileOpportunityCollection';
    result.contents = collection.contents.map(convertObject);
  } else {
    result.name = collection.name;
    result.contents = _.map(collection.contents, convertObject);
  }
  // console.log(result.name/* , result.contents */);
  return result;
};

const reinitializedCollections = [];

const addedCollections = ['AdminProfileCollection', 'PageInterestCollection', 'PageInterestsDailySnapshotCollection', 'UserInteractionCollection'].concat(reinitializedCollections);

const addMissingCollections = (result) => {
  addedCollections.forEach(collectionName => {
    if (!(result.collections.find(entry => entry.name === collectionName))) {
      const coll: any = {};
      coll.name = collectionName;
      coll.contents = [];
      result.collections.push(coll);
    }
  });
};

const deletedCollections = ['DesiredDegreeCollection', 'MentorAnswerCollection', 'MentorProfileCollection', 'MentorQuestionCollection', 'UserInteractionCollection', 'AcademicPlanCollection',
  'FavoriteAcademicPlanCollection', 'PlanChoiceCollection', 'AdvisorLogCollection', 'HelpMessageCollection'].concat(reinitializedCollections);

const processRadGradCollections = (data: IDataDump) => {
  const result: any = {};
  result.timestamp = moment().format(databaseFileDateFormat);
  result.collections = [];
  _.forEach(data.collections, (c) => {
    if (!deletedCollections.includes(c.name)) {
      result.collections.push(processRadGradCollection(c));
    }
  });
  addMissingCollections(result);
  return result;
};

const compareEntries = (entry1, entry2) => {
  if (entry1.name < entry2.name) {
    return -1;
  }
  if (entry1.name > entry2.name) {
    return 1;
  }
  return 0;
};

async function convertDump(radgrad1DumpFile, outFileName) {
  const data = fs.readFileSync(radgrad1DumpFile);
  radGrad1DataDump = JSON.parse(data.toString());
  const radgrad2 = processRadGradCollections(radGrad1DataDump);
  const data2 = JSON.stringify(radgrad2, null, 2);
  radgrad2.collections.sort((entry1, entry2) => compareEntries(entry1, entry2));
  radgrad2.collections.forEach(entry => console.log(entry.name, entry.contents.length));
  fs.writeFileSync(outFileName, data2);
  console.log(`Convert Dump: ${radgrad1DumpFile} --> ${outFileName}`);
}

program
  .arguments('<radgrad1DumpFile> <outFileName>')
  .description('Parse a RadGrad1 dump file and create a new one in RadGrad2 format.', {
    radgrad1DumpFile: 'A pre-existing RadGrad1 database dump file',
    outFileName: 'The name of the RadGrad2 database dump file to be created',
  })
  .action((radgrad1DumpFile, outFileName) => convertDump(radgrad1DumpFile, outFileName));

program.parse(process.argv);
