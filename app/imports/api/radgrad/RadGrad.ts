import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { AdminProfiles } from '../user/AdminProfileCollection';
import { AdvisorProfiles } from '../user/AdvisorProfileCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { StudentParticipations } from '../public-stats/StudentParticipationCollection';
import { Courses } from '../course/CourseCollection';
import { CourseInstances } from '../course/CourseInstanceCollection';
import { FacultyProfiles } from '../user/FacultyProfileCollection';
import { FeedbackInstances } from '../feedback/FeedbackInstanceCollection';
import { Feeds } from '../feed/FeedCollection';
import { HelpMessages } from '../help/HelpMessageCollection';
import { IceSnapshots } from '../analytic/IceSnapshotCollection';
import { Interests } from '../interest/InterestCollection';
import { InterestTypes } from '../interest/InterestTypeCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { OpportunityTypes } from '../opportunity/OpportunityTypeCollection';
import { PublicStats } from '../public-stats/PublicStatsCollection';
import { Reviews } from '../review/ReviewCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Slugs } from '../slug/SlugCollection';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { Teasers } from '../teaser/TeaserCollection';
import { UserInteractions } from '../analytic/UserInteractionCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
import { FavoriteCareerGoals } from '../favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../favorite/FavoriteOpportunityCollection';
import { PageInterestsDailySnapshots } from '../page-tracking/PageInterestsDailySnapshotCollection';
import { PageInterests } from '../page-tracking/PageInterestCollection';

/**
 * @memberOf api/radgrad
 */
class RadGradClass {
  public collections: any[];

  public collectionLoadSequence;

  private readonly collectionAssociation;

  public calcLevel?: (studentID: string) => number;

  constructor() {
    /**
     * A list of all RadGrad API collections in alphabetical order.
     * This list is used for things like checking integrity.
     */
    this.collections = [
      AcademicYearInstances,
      AdminProfiles,
      AdvisorProfiles,
      CareerGoals,
      StudentParticipations,
      Courses,
      CourseInstances,
      FacultyProfiles,
      FavoriteCareerGoals,
      FavoriteCourses,
      FavoriteInterests,
      FavoriteOpportunities,
      Feeds,
      FeedbackInstances,
      HelpMessages,
      IceSnapshots,
      Interests,
      InterestTypes,
      Opportunities,
      OpportunityInstances,
      OpportunityTypes,
      PageInterests,
      PageInterestsDailySnapshots,
      PublicStats,
      Reviews,
      AcademicTerms,
      Slugs,
      StudentProfiles,
      Teasers,
      UserInteractions,
      VerificationRequests,
    ];

    /**
     * A list of collection class instances in the order required for them to be sequentially loaded from a file.
     * Note that some collection class instances are implicitly initialized and so do not appear in this list.
     * This is the list used to specify the collections for both dump and restore.
     * For example: Slugs, AcademicYearInstances, and PublicStats.
     * Some collections are not yet part of dump/restore.
     */
    this.collectionLoadSequence = [
      AcademicTerms,
      HelpMessages,
      InterestTypes,
      Interests,
      CareerGoals,
      AdminProfiles,
      AdvisorProfiles,
      FacultyProfiles,
      OpportunityTypes,
      Opportunities,
      Courses,
      Teasers,
      StudentProfiles,
      CourseInstances,
      OpportunityInstances,
      FeedbackInstances,
      VerificationRequests,
      Feeds,
      IceSnapshots,
      UserInteractions,
      PageInterests,
      PageInterestsDailySnapshots,
      Reviews,
      FavoriteCareerGoals,
      FavoriteCourses,
      FavoriteInterests,
      FavoriteOpportunities,
    ];

    /**
     * An object with keys equal to the collection name and values the associated collection instance.
     */
    this.collectionAssociation = {};
    _.forEach(this.collections, (collection) => {
      this.collectionAssociation[collection.getCollectionName()] = collection;
    });
  }

  /**
   * Return the collection class instance given its name.
   * @param collectionName The name of the collection.
   * @returns The collection class instance.
   * @throws { Meteor.Error } If collectionName does not name a collection.
   */
  public getCollection(collectionName) {
    const collection = this.collectionAssociation[collectionName];
    if (!collection) {
      throw new Meteor.Error(`Called RadGrad.getCollection with unknown collection name: ${collectionName}`);
    }
    return collection;
  }
}

/**
 * Provides the singleton instance of this class.
 * @type {api/radgrad.RadGradClass}
 * @memberOf api/radgrad
 */
export const RadGrad = new RadGradClass();
