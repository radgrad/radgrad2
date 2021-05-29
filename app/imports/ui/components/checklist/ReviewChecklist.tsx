import React from 'react';
import _ from 'lodash';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { STUDENT_REVIEWS, URL_ROLES } from '../../layouts/utilities/route-constants';
import CourseList from '../shared/CourseList';
import OpportunityList from '../shared/OpportunityList';
import { Checklist, CHECKSTATE } from './Checklist';
import { DetailsBox } from './DetailsBox';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonLink } from './ChecklistButtons';

export class ReviewChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Reviews';
    this.profile = Users.getProfile(student);
    this.iconName = 'star half';
    this.title[CHECKSTATE.OK] = 'Thanks for reviewing your completed Courses and Opportunities';
    this.title[CHECKSTATE.REVIEW] = 'Please review your completed Courses and Opportunities';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats! You've reviewed all of your completed Courses and Opportunities. 
      This makes RadGrad more useful.`;
    this.description[CHECKSTATE.REVIEW] = `Reviewing Courses and Opportunities you&apos;ve completed provides 
      valuable insight to future students. This is your chance to pay it forward!`;
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
    const courseReviews = reviews.filter((rev) => rev.reviewType === Reviews.COURSE);
    const opportunityReviews = reviews.filter((rev) => rev.reviewType !== Reviews.COURSE);
    const nonReviewedCourses = courses.filter((course) => {
      let reviewed = true;
      courseReviews.forEach((review) => {
        if (review.revieweeID === course._id) {
          reviewed = false;
        }
      });
      return reviewed;
    });
    const nonReviewedOpportunities = opportunities.filter((opportunity) => {
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
            <CourseList courses={courses} keyStr="review" size="medium" userID={this.profile.userID} />
            <OpportunityList opportunities={opportunities} size="medium" keyStr="review" userID={this.profile.userID} />
          </DetailsBox>
        );
      case CHECKSTATE.REVIEW:
        return (
          <DetailsBox description='You have not reviewed the following completed Courses and Opportunities:'>
            <CourseList courses={nonReviewedCourses} size="medium" keyStr="review" userID={this.profile.userID} />
            <OpportunityList opportunities={nonReviewedOpportunities} size="medium" keyStr="review" userID={this.profile.userID} />
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
          <ActionsBox description={`Go to the Reviews page to ${phrase} for your completed Courses and Opportunities:`}>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${STUDENT_REVIEWS}`} label='Reviews Page'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }
}
