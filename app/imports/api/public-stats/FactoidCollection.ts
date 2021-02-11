import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { iceSchema } from '../ice/IceProcessor';


const interestFactoid = new SimpleSchema({
  name: { type: String },
  numberOfStudents: { type: Number },
  numberOfOpportunities: { type: Number },
  numberOfCourses: { type: Number },
  description: { type: String },
});

const levelsFactoid = new SimpleSchema({
  levelIconName: { type: String },
  numberOfStudents: { type: Number },
  description: { type: String },
});

const reviewsFactoid = new SimpleSchema({
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
      interestFactoid,
      careerGoalFactoid: interestFactoid,
      levelsFactoid,
      reviewsFactoid,
      opportunityFactoid,
    }));
  }
}

export const Factoids = new FactoidCollection();
