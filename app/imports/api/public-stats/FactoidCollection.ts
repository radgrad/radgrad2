import SimpleSchema from 'simpl-schema';
import {
  InterestOrCareerGoalFactoidProps,
  LevelFactoidProps,
  OpportunityFactoidProps,
  ReviewFactoidProps,
} from '../../typings/radgrad';
import BaseCollection from '../base/BaseCollection';
import { iceSchema } from '../ice/IceProcessor';


const interestFactoid = new SimpleSchema({
  name: { type: String },
  numberOfStudents: { type: Number },
  numberOfOpportunities: { type: Number },
  numberOfCourses: { type: Number },
  description: { type: String },
});

const careerGoalFactoid = interestFactoid;

const levelFactoid = new SimpleSchema({
  level: { type: Number },
  numberOfStudents: { type: Number },
  description: { type: String },
});

const reviewFactoid = new SimpleSchema({
  name: { type: String },
  description: { type: String },
});

const opportunityFactoid = new SimpleSchema({
  picture: { type: String },
  name: { type: String },
  ice: { type: iceSchema },
  description: { type: String },
  numberOfStudents: { type: Number },
});

class FactoidCollection extends BaseCollection {
  constructor() {
    super('Factoid', new SimpleSchema({
      careerGoalFactoid: { type: careerGoalFactoid, optional: true },
      interestFactoid: { type: interestFactoid, optional: true },
      levelFactoid: { type: levelFactoid, optional: true },
      reviewFactoid: { type: reviewFactoid, optional: true },
      opportunityFactoid: { type: opportunityFactoid, optional: true },
    }));
  }

  public getInterestFactoid = (): InterestOrCareerGoalFactoidProps => {
    const doc = this.findOne({});
    return doc?.interestFactoid;
  };

  public updateInterestFactoid = ({
    name,
    description,
    numberOfCourses,
    numberOfOpportunities,
    numberOfStudents,
  }: InterestOrCareerGoalFactoidProps) => {
    this.collection.upsert({}, {
      $set: {
        interestFactoid:
          {
            name, description, numberOfCourses, numberOfOpportunities, numberOfStudents,
          },
      },
    });
  };

  public getCareerGoalFactoid = (): InterestOrCareerGoalFactoidProps => {
    const doc = this.findOne({});
    return doc?.careerGoalFactoid;
  };

  public updateCareerGoalFactoid = ({
    name,
    description,
    numberOfCourses,
    numberOfOpportunities,
    numberOfStudents,
  }: InterestOrCareerGoalFactoidProps) => {
    this.collection.upsert({}, {
      $set: {
        careerGoalFactoid:
          {
            name, description, numberOfCourses, numberOfOpportunities, numberOfStudents,
          },
      },
    });
  };

  public getLevelFactoid = (): LevelFactoidProps => {
    const doc = this.findOne({});
    return doc?.levelFactoid;
  };

  public updateLevelFactoid = ({
    level,
    description,
    numberOfStudents,
  }: LevelFactoidProps) => {
    this.collection.upsert({}, {
      $set: {
        levelFactoid:
          {
            level, description, numberOfStudents,
          },
      },
    });
  };

  public getReviewFactoid = (): ReviewFactoidProps => {
    const doc = this.findOne({});
    return doc?.reviewFactoid;
  };

  public updateReviewFactoid = ({name, description}: ReviewFactoidProps) => {
    this.collection.upsert({}, {
      $set: {
        reviewFactoid: { name, description },
      },
    });
  };

  public getOpportunityFactoid = (): OpportunityFactoidProps => {
    const doc = this.findOne({});
    return doc?.opportunityFactoid;
  };

  public updateOpportunityFactoid = ({name, numberOfStudents, description, picture, ice}: OpportunityFactoidProps) => {
    this.collection.upsert({}, {
      $set: {
        opportunityFactoid: { name, numberOfStudents, description, picture, ice },
      },
    });
  };
}

export const Factoids = new FactoidCollection();
