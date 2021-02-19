import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import { ChecklistState } from '../../../api/checklist/ChecklistState';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { EXPLORER, STUDENT_REVIEWS, URL_ROLES } from '../../layouts/utilities/route-constants';
import CourseList from '../shared/CourseList';
import OpportunityList from '../shared/OpportunityList';
import { Checklist } from './Checklist';

export class ReviewChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    // console.log('ReviewChecklist', this.profile, StudentProfiles.findDoc(student));
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
      this.state = 'Review';
    } else {
      this.state = 'OK';
    }
  }

  public getTitle(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <Header>Please consider writing reviews for your completed Courses and Opportunities.</Header>;
      case 'OK':
        return <Header>Thanks for having written reviews.</Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <p>Writing reviews for the Courses and Opportunities you&apos;ve completed provides valuable insight to
          future students who may be considering them. This is your chance to pay it forward!</p>;
      case 'OK':
        return <p>Congrats! You&apos;ve provided reviews for all of your completed Courses and Opportunities. This is a
          service to the community and makes RadGrad more useful.</p>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: ChecklistState): JSX.Element {
    const studentID = this.profile.userID;
    const ois = OpportunityInstances.findNonRetired({ studentID, verified: true });
    const opportunities = _.uniq(ois.map((oi) => Opportunities.findDoc(oi.opportunityID)));
    const cis = CourseInstances.findNonRetired({ studentID, verified: true });
    const courses = _.uniq(cis.map((ci) => Courses.findDoc(ci.courseID)));
    const reviews = Reviews.findNonRetired({ studentID });
    const courseReviews = _.filter(reviews, (rev) => rev.reviewType === Reviews.COURSE);
    const opportunityReviews = _.filter(reviews, (rev) => rev.reviewType !== Reviews.COURSE);
    const nonReviewedCourses = _.filter(courses, (course) => {
      let reviewed = false;
      courseReviews.forEach((review) => {
        console.log(review.revieweeID, course._id);
        if (review.revieweeID === course._id) {
          reviewed = true;
        }
      });
      return reviewed;
    });
    const nonReviewedOpportunities = _.filter(opportunities, (opportunity) => {
      let reviewed = false;
      opportunityReviews.forEach((review) => {
        if (review.revieweeID === opportunity._id) {
          reviewed = true;
        }
      });
      return reviewed;
    });
    switch (state) {
      case 'OK':
        return <p>You have written reviews for the following Courses and Opportunities: <CourseList courses={courses}
                                                                                                    size="medium" />
          <OpportunityList opportunities={opportunities} size="medium" />.</p>;
      case 'Review':
        return <div>
          <p>You have the following completed Courses and Opportunities for which you have not written a review:</p>
          <CourseList courses={nonReviewedCourses} size="medium" /><OpportunityList
          opportunities={nonReviewedOpportunities} size="medium" /></div>;
      default:
        return <React.Fragment />;
    }
  }

  public getActions(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <div>
          <p>Click &quot;Go To Reviews&quot; to add reviews for your completed Courses or Opportunities.</p>
          <Button as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${STUDENT_REVIEWS}`}>Go To
            Reviews</Button></div>;
      case 'OK':
        return <div>
          <p>Click &quot;Go to Course Explorer&quot; if you want to see your Course reviews and potentially update them,
            or click &quot;Go to Opportunity Explorer&quot; if you want to see your Opportunity reviews and potentially
            update them.</p>
          <Button as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.COURSES}`}>Go To Course
            Explorer</Button>
          <Button as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.OPPORTUNITIES}`}>Go To
            Opportunity Explorer</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }
}
