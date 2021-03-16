import React from 'react';
import _ from 'lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import {STUDENT_REVIEWS, URL_ROLES} from '../../layouts/utilities/route-constants';
import CourseList from '../shared/CourseList';
import OpportunityList from '../shared/OpportunityList';
import {Checklist, CHECKSTATE} from './Checklist';
import {DetailsBox} from './DetailsBox';
import {ActionsBox} from './ActionsBox';
import {ChecklistButtonLink} from './ChecklistButtons';

export class ReviewChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Reviews';
    this.profile = Users.getProfile(student);
    this.iconName = 'star half';
    this.title[CHECKSTATE.OK] = 'Thanks for having reviewed your completed Courses and/or Opportunities';
    this.title[CHECKSTATE.REVIEW] = 'Please consider writing Reviews for your completed Courses and/or Opportunities';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats! You've provided reviews for all of your completed Courses and Opportunities. 
      This is a service to the community and makes RadGrad more useful.`;
    this.description[CHECKSTATE.REVIEW] = `Writing reviews for the Courses and Opportunities you&apos;ve completed provides 
      valuable insight to future students who may be considering them. This is your chance to pay it forward!`;

    this.updateState();
  }

  public updateState(): void {
    const studentID = this.profile.userID;
    const ois = OpportunityInstances.findNonRetired({ studentID, verified: true });
    const opportunityIDs = _.uniq(ois.map((oi) => oi.opportunityID));
    const cis = CourseInstances.findNonRetired({ studentID, verified: true });
    const courseIDs = _.uniq(cis.map((ci) => ci.courseID));
    const reviews = Reviews.findNonRetired({ studentID });
    if (reviews.length < courseIDs.length + opportunityIDs.length) {
      this.state = CHECKSTATE.REVIEW;
    } else {
      this.state = CHECKSTATE.OK;
    }
  }

  public getDetails(): JSX.Element {
    const studentID = this.profile.userID;
    const ois = OpportunityInstances.findNonRetired({ studentID, verified: true });
    const opportunityIDs = _.uniq(ois.map((oi) => oi.opportunityID));
    const opportunities = opportunityIDs.map((oID) => Opportunities.findDoc(oID));
    const cis = CourseInstances.findNonRetired({ studentID, verified: true });
    const courseIDs = _.uniq(cis.map((ci) => ci.courseID));
    const courses = courseIDs.map((cID) => Courses.findDoc(cID));
    const reviews = Reviews.findNonRetired({ studentID });
    const courseReviews = _.filter(reviews, (rev) => rev.reviewType === Reviews.COURSE);
    const opportunityReviews = _.filter(reviews, (rev) => rev.reviewType !== Reviews.COURSE);
    const nonReviewedCourses = _.filter(courses, (course) => {
      let reviewed = true;
      courseReviews.forEach((review) => {
        if (review.revieweeID === course._id) {
          reviewed = false;
        }
      });
      return reviewed;
    });
    const nonReviewedOpportunities = _.filter(opportunities, (opportunity) => {
      let reviewed = true;
      opportunityReviews.forEach((review) => {
        if (review.revieweeID === opportunity._id) {
          reviewed = false;
        }
      });
      return reviewed;
    });
    switch (this.state) {
      case CHECKSTATE.OK:
        return (
          <DetailsBox description='You have reviewed the following completed Courses and Opportunities:'>
            <CourseList courses={courses} keyStr="review" size="medium" />
            <OpportunityList opportunities={opportunities} size="medium" keyStr="review" />
          </DetailsBox>
        );
      case CHECKSTATE.REVIEW:
        return (
            <DetailsBox description='You have not reviewed the following completed Courses and Opportunities:'>
              <CourseList courses={nonReviewedCourses} size="medium" keyStr="review" />
              <OpportunityList opportunities={nonReviewedOpportunities} size="medium" keyStr="review" />
            </DetailsBox>
        );
      default:
        return <React.Fragment />;
    }
  }

  public getActions(): JSX.Element {
    const phrase = CHECKSTATE.REVIEW ? 'add reviews' : 'see your reviews';
    switch (this.state) {
      case CHECKSTATE.REVIEW:
      case CHECKSTATE.OK:
        return (
          <ActionsBox description={`Go to the Reviews page to ${phrase} for your completed Courses and/or Opportunities:`}>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${STUDENT_REVIEWS}`} label='Reviews Page'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
