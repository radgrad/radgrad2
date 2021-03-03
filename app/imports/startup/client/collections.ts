import { Mongo } from 'meteor/mongo';

export const CourseScoreboard = new Mongo.Collection('CourseScoreboard');
export const OpportunityScoreboard = new Mongo.Collection('OpportunityScoreboard');
export const CareerGoalsScoreboard = new Mongo.Collection('ProfileCareerGoalsScoreboard');
export const CoursesScoreboard = new Mongo.Collection('ProfileCourseScoreboard');
export const InterestsScoreboard = new Mongo.Collection('ProfileInterestsScoreboard');
export const OpportunitiesScoreboard = new Mongo.Collection('ProfileOpportunitiesScoreboard');
