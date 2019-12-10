import { Mongo } from 'meteor/mongo';
import {
  AcademicPlanFavoritesScoreboardName,
  CareerGoalFavoritesScoreboardName, CourseFavoritesScoreboardName,
  CourseScoreboardName, InterestFavoritesScoreboardName, OpportunityFavoritesScoreboardName,
  OpportunityScoreboardName,
} from '../both/names';

export const CourseScoreboard = new Mongo.Collection(CourseScoreboardName);
export const OpportunityScoreboard = new Mongo.Collection(OpportunityScoreboardName);
export const AcademicPlanFavoritesScoreboard = new Mongo.Collection(AcademicPlanFavoritesScoreboardName);
export const CareerGoalFavoritesScoreboard = new Mongo.Collection(CareerGoalFavoritesScoreboardName);
export const CourseFavoritesScoreboard = new Mongo.Collection(CourseFavoritesScoreboardName);
export const InterestFavoritesScoreboard = new Mongo.Collection(InterestFavoritesScoreboardName);
export const OpportunityFavoritesScoreboard = new Mongo.Collection(OpportunityFavoritesScoreboardName);
