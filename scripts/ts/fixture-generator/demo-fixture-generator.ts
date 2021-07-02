import { program } from 'commander';
import * as fs from 'fs';
import moment from 'moment';
import { getCollectionData, getNonRetiredCollectionData } from '../data-dump-utils';
import AcademicTermCollection from './AcademicTermCollection';
import { generateCourseInstance } from './course-instance-utilities';
import { InternshipDefine } from './internship-utilities';
import { generateOpportunityInstance, OpportunityInstance } from './opportunity-instance-utilities';
import RadGradCollection, { RadGradCollectionName } from './RadGradCollection';
import { generateReview } from './review-utilities';
import { StudentConfig } from './user-config-file';
import { validateFixture } from './validation-utilities';
import { generateVerificationRequest } from './verification-request-utilities';

export interface Doc {
  slug?: string;
  term?: string;
  academicTerm?: string;
  student?: string;
  opportunity?: string;
  targetSlug?: string;
  interests?: string[];
  careerGoals?: string[];
  profileCourses?: string[];
  profileOpportunities: string[];
  verified?: boolean;
  retired?: boolean;
}

export interface ICollection {
  name: string;
  contents: Doc[];
}

export interface IDataDump {
  timestamp: string;
  collections: ICollection[];
}

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';
const copyCollectionNames = [RadGradCollectionName.ACADEMIC_TERMS, RadGradCollectionName.ADMIN_PROFILES, RadGradCollectionName.ADVISOR_PROFILES, RadGradCollectionName.CAREER_GOALS, RadGradCollectionName.COURSES, RadGradCollectionName.FACULTY_PROFILES, RadGradCollectionName.INTERESTS, RadGradCollectionName.INTEREST_TYPES, RadGradCollectionName.OPPORTUNITIES, RadGradCollectionName.OPPORTUNITY_TYPES, RadGradCollectionName.TEASERS];

const buildCourseInstanceCollection = (studentConfig: StudentConfig, academicTerms: AcademicTermCollection, courses: RadGradCollection): ICollection => {
  const result = {
    name: RadGradCollectionName.COURSE_INSTANCES,
    contents: [],
  };
  studentConfig.studentPlans.forEach((plan) => {
    const student = plan.username;
    plan.courses.forEach((p) => {
      if (courses.isDefinedSlug(p.slug)) {
        result.contents.push(generateCourseInstance(student, p, academicTerms));
      } else {
        throw new Error(`Student ${plan.username} has a course instance ${p.slug} that is not a defined course.`);
      }
    });
  });
  return result;
};

const buildOpportunityInstanceCollection = (studentConfig: StudentConfig, academicTerms: AcademicTermCollection, opportunities: RadGradCollection): ICollection => {
  const result = {
    name: RadGradCollectionName.OPPORTUNITY_INSTANCES,
    contents: [],
  };
  const currentTerm = academicTerms.getCurrentTerm();
  const quarters = academicTerms.isQuarterSystem();
  studentConfig.studentPlans.forEach((plan) => {
    const student = plan.username;
    plan.opportunities.forEach((p) => {
      if (opportunities.isDefinedSlug(p.slug)) {
        result.contents.push(generateOpportunityInstance(student, p, currentTerm, quarters));
      } else {
        throw new Error(`Student ${plan.username} has an opportunity instance ${p.slug} that is not a defined opportunity slug.`);
      }
    });
  });
  return result;
};

const buildReviewsCollection = (studentConfig: StudentConfig, academicTerms: AcademicTermCollection, opportunities: RadGradCollection, courses: RadGradCollection): ICollection => {
  const result = {
    name: RadGradCollectionName.REVIEWS,
    contents: [],
  };
  const currentTerm = academicTerms.getCurrentTerm();
  const quarters = academicTerms.isQuarterSystem();
  studentConfig.studentPlans.forEach((plan) => {
    const student = plan.username;
    plan.reviews.forEach((p) => {
      if (opportunities.isDefinedSlug(p.reviewee) || courses.isDefinedSlug(p.reviewee)) {
        result.contents.push(generateReview(student, p, academicTerms, opportunities));
      } else {
        throw new Error(`Student ${plan.username} has a review of ${p.reviewee} which is not a defined course or opportunity`);
      }
    });
  });

  return result;
};

const compareCollections = (entry1, entry2) => {
  if (entry1.name < entry2.name) {
    return -1;
  }
  if (entry1.name > entry2.name) {
    return 1;
  }
  return 0;
};

/**
 * Builds the StudentProfileCollection. We'll take the studentConfig's StudentProfiles and just add them.
 * @param {StudentConfig} studentConfig
 * @return {ICollection}
 */
const buildStudentProfileCollection = (studentConfig: StudentConfig): ICollection => {
  const result = {
    name: RadGradCollectionName.STUDENT_PROFILES,
    contents: [],
  };
  studentConfig.studentProfiles.contents.forEach((profile) => {
     result.contents.push(profile);
  });
  return result;
};

const buildVerificationRequestCollection = (opportunities: ICollection): ICollection => {
  const result = {
    name: RadGradCollectionName.VERIFICATION_REQUESTS,
    contents: [],
  };
  opportunities.contents.forEach((opp) => {
    if (opp.verified) {
      result.contents.push(generateVerificationRequest(opp as OpportunityInstance));
    }
  });
  return result;
};
const convertRawInternship = (internship, interests, careerGoals) => {
  // get some random interests to assign to the internship. Need to update this with smartness.
  const numInterests = Math.floor(Math.random() * 5);
  const randInterests = [];
  for (let i = 0; i < numInterests; i++) {
    randInterests.push(interests[Math.floor(Math.random() * interests.length)]);
  }
  const numCareerGoals = Math.floor(Math.random() * 5);
  const randCareerGoals = [];
  for (let i = 0; i < numCareerGoals; i++) {
    randCareerGoals.push(careerGoals[Math.floor(Math.random() * careerGoals.length)]);
  }
  const internshipDefine: InternshipDefine = {
    urls: [internship.url],
    position: internship.position,
    description: internship.description,
    lastUploaded: internship.lastUploaded,
    interests: randInterests,
    careerGoals: randCareerGoals,
    company: internship.company,
    location: internship.location,
    posted: internship.posted,
    missedUploads: 0, // How are we going to calculate this?
  };
  return internshipDefine;
};

const createInternshipFixture = (radgradDump: IDataDump, rawInternships) => {
  const interestCollection = new RadGradCollection(RadGradCollectionName.INTERESTS, getCollectionData(radgradDump, RadGradCollectionName.INTERESTS));
  const interests = interestCollection.getSlugs();
  const careerGoalCollection = new RadGradCollection(RadGradCollectionName.CAREER_GOALS, getCollectionData(radgradDump, RadGradCollectionName.CAREER_GOALS));
  const careerGoals = careerGoalCollection.getSlugs();
  const internshipFixture = {
    name: RadGradCollectionName.INTERNSHIPS,
    contents: [],
  };
  rawInternships.forEach(internship => {
    internshipFixture.contents.push(convertRawInternship(internship, interests, careerGoals));
  });
  return internshipFixture;
};

const createFixture = (radgradDump: IDataDump, studentConfig: StudentConfig, academicTerms: AcademicTermCollection, rawInternships): IDataDump => {
  const result: IDataDump = {
    timestamp: `${moment().format(databaseFileDateFormat)}`,
    collections: [],
  };
  radgradDump.collections.forEach((coll) => {
    // @ts-ignore
    if (copyCollectionNames.includes(coll.name)) {
      // eslint-disable-next-line no-param-reassign
      coll.contents = coll.contents.filter((doc) => !doc.retired); // We don't want retired items.
      if (coll.name === RadGradCollectionName.FACULTY_PROFILES || coll.name === RadGradCollectionName.ADVISOR_PROFILES) { // Ensure advisors, faculty have profileCourses and profileOpportunities
        coll.contents.forEach((profile) => {
          if (!profile.profileOpportunities) {
            // eslint-disable-next-line no-param-reassign
            profile.profileOpportunities = [];
          }
          if (!profile.profileCourses) {
            // eslint-disable-next-line no-param-reassign
            profile.profileCourses = [];
          }
        });
      }
      result.collections.push(coll);
    }
  });
  // Build the course instance collection
  const courses = new RadGradCollection(RadGradCollectionName.COURSES, getNonRetiredCollectionData(radgradDump, RadGradCollectionName.COURSES));
  const ciCollection: ICollection = buildCourseInstanceCollection(studentConfig, academicTerms, courses);
  result.collections.push(ciCollection);
  // Build the student profile collection
  const studentProfileCollection: ICollection = buildStudentProfileCollection(studentConfig);
  result.collections.push(studentProfileCollection);
  // Build the opportunity instance collection
  // Need the opportunities to build the opportunity instances
  const opportunities = new RadGradCollection(RadGradCollectionName.OPPORTUNITIES, getNonRetiredCollectionData(radgradDump, RadGradCollectionName.OPPORTUNITIES));
  const oiCollection: ICollection = buildOpportunityInstanceCollection(studentConfig, academicTerms, opportunities);
  result.collections.push(oiCollection);
  result.collections.push(buildVerificationRequestCollection(oiCollection));
  result.collections.push(buildReviewsCollection(studentConfig, academicTerms, opportunities, courses));
  // Empty collections so we can load. Will fill in later
  result.collections.push({
    name: RadGradCollectionName.PROFILE_CAREER_GOALS,
    contents: [],
  });
  result.collections.push({
    name: RadGradCollectionName.PROFILE_COURSES,
    contents: [],
  });
  result.collections.push({
    name: RadGradCollectionName.PROFILE_INTERESTS,
    contents: [],
  });
  result.collections.push({
    name: RadGradCollectionName.PROFILE_OPPORTUNITIES,
    contents: [],
  });
  result.collections.push({
    name: RadGradCollectionName.USER_INTERACTIONS,
    contents: [],
  });
  result.collections.push(createInternshipFixture(radgradDump, rawInternships));
  // sort the collections
  result.collections.sort((entry1, entry2) => compareCollections(entry1, entry2));
  validateFixture(result);
  return result;
};

async function generateDemoFixture(radgradDumpFile, userConfigFile, internshipFile) {
  console.log('generateDemoFixture', radgradDumpFile, userConfigFile, internshipFile);
  const fixtureFileName = `data/${moment().format(databaseFileDateFormat)}.json`;
  console.log(fixtureFileName);
  const data = fs.readFileSync(radgradDumpFile);
  const radgradDump = JSON.parse(data.toString());
  const academicTerms = new AcademicTermCollection(getCollectionData(radgradDump, RadGradCollectionName.ACADEMIC_TERMS));
  const configData = fs.readFileSync(userConfigFile);
  const userConfig: StudentConfig = JSON.parse(configData.toString());
  const internshipData = fs.readFileSync(internshipFile);
  const rawInternships = JSON.parse(internshipData.toString());
  const fixture = createFixture(radgradDump, userConfig, academicTerms, rawInternships);
  const fixtureString = JSON.stringify(fixture, null, 2);
  fs.writeFileSync(fixtureFileName, fixtureString);
}

program
  .arguments('<radgradDumpFile> <userConfigFile> <internshipFile>')
  .description('Creates a demo fixture file based upon the RadGrad dump file, a user config file and an internship file.', {
    radgradDumpFile: 'A pre-existing RadGrad2 database dump file',
    userConfigFile: 'A pre-existing user configuration file',
    internshipFile: 'A pre-existing internship file in the canonical format',
  })
  .action((radgradDumpFile, userConfigFile, internshipFile) => generateDemoFixture(radgradDumpFile, userConfigFile, internshipFile));

program.parse(process.argv);
