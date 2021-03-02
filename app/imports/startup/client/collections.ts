import { Mongo } from 'meteor/mongo';

export const CourseScoreboard = new Mongo.Collection('CourseScoreboard');
export const OpportunityScoreboard = new Mongo.Collection('OpportunityScoreboard');
export const CareerGoalFavoritesScoreboard = new Mongo.Collection('ProfileCareerGoalsScoreboard');
export const CourseFavoritesScoreboard = new Mongo.Collection('ProfileCourseScoreboard');
export const InterestFavoritesScoreboard = new Mongo.Collection('ProfileInterestsScoreboard');
export const OpportunityFavoritesScoreboard = new Mongo.Collection('ProfileOpportunitiesScoreboard');
