import * as React from 'react';
import { Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Semesters } from '../../../api/semester/SemesterCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';

export interface IReady {
  ready: boolean;
}

class WithGlobalSubscriptions extends React.Component<IReady, {}> {

  /**
   * Creates a new WithGlobalSubscriptions instance.
   * @param props the Properties.
   */
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting global data</Loader>;
  }

  public renderPage() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

// Idea from https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const handles = [
    Meteor.subscribe(AcademicPlans.getPublicationName()),
    Meteor.subscribe(AdvisorProfiles.getPublicationName()),
    Meteor.subscribe(CareerGoals.getPublicationName()),
    Meteor.subscribe(Courses.getPublicationName()),
    Meteor.subscribe(DesiredDegrees.getPublicationName()),
    Meteor.subscribe(FacultyProfiles.getPublicationName()),
    Meteor.subscribe(HelpMessages.getPublicationName()),
    Meteor.subscribe(Interests.getPublicationName()),
    Meteor.subscribe(InterestTypes.getPublicationName()),
    Meteor.subscribe(MentorProfiles.getPublicationName()),
    Meteor.subscribe(Opportunities.getPublicationName()),
    Meteor.subscribe(OpportunityTypes.getPublicationName()),
    Meteor.subscribe(PlanChoices.getPublicationName()),
    Meteor.subscribe(Reviews.getPublicationName()),
    Meteor.subscribe(Semesters.getPublicationName()),
    Meteor.subscribe(StudentProfiles.getPublicationName()),
    Meteor.subscribe(Slugs.getPublicationName()),
    Meteor.subscribe(Teasers.getPublicationName()),
    Meteor.subscribe(Users.getPublicationName()),
  ];
  return {
    ready: !handles.some((handle) => !handle.ready()),
  };
})(WithGlobalSubscriptions);
