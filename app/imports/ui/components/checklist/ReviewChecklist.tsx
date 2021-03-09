import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Button, Header, Icon } from 'semantic-ui-react';
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
import '../../../../client/style.css';

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
      this.state = 'Awesome';
    }
  }

  public getIcon(): string | JSX.Element {
    return <Icon name="star half" color="grey" /> ;
  }

  public getTitle(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <Header as='h1'>Please consider writing <strong>Reviews</strong> for your completed <strong>Courses and Opportunities</strong></Header>;
      case 'Awesome':
        return <Header as='h1'>Thanks for having written <strong>Reviews</strong></Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <p>Writing reviews for the Courses and Opportunities you&apos;ve completed provides valuable insight to
          future students who may be considering them. This is your chance to pay it forward!</p>;
      case 'Awesome':
        return <p>Congrats! You&apos;ve provided reviews for all of your completed Courses and Opportunities. This is a
          service to the community and makes RadGrad more useful.</p>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: ChecklistState): JSX.Element {
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
    switch (state) {
      case 'Awesome':
        return <div className='highlightBox'><p>You have written reviews for the following Courses and Opportunities:
          <CourseList courses={courses} keyStr="review"                                                              size="medium" />
          <OpportunityList opportunities={opportunities} size="medium" keyStr="review" />.</p></div>;
      case 'Review':
        return <div className='highlightBox'>
          <p>You have the following completed Courses and Opportunities for which you have not written a review:</p>
          <CourseList courses={nonReviewedCourses} size="medium" keyStr="review" /><OpportunityList
          opportunities={nonReviewedOpportunities} size="medium" keyStr="review" /></div>;
      default:
        return <React.Fragment />;
    }
  }

  public getActions(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Review':
        return <div className='centeredBox'>
          <p>Click &quot;Go To Reviews&quot; to add reviews for your completed Courses or Opportunities.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${STUDENT_REVIEWS}`}>Go To
            Reviews</Button></div>;
      case 'Awesome':
        return <div className='centeredBox'>
          <p>Click &quot;Go to Course Explorer&quot; if you want to see your Course reviews and potentially update them,
            or click &quot;Go to Opportunity Explorer&quot; if you want to see your Opportunity reviews and potentially
            update them.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.COURSES}`}>Go To Course
            Explorer</Button>&nbsp;&nbsp;
          <Button basic size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.OPPORTUNITIES}`}>Go To
            Opportunity Explorer</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }
}
