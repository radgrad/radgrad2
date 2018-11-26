import * as React from 'react';
import { Grid, Image, Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import FirstMenuContainer from '../shared/FirstMenu';
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
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import Footer from '../../components/Footer';
import SecondMenu from '../shared/SecondMenu';

interface IAdminHome {
  ready: boolean;
}
/** A simple static component to render some text for the landing page. */
class AdminHome extends React.Component<IAdminHome, {}> {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting data</Loader>;
  }

  public renderPage() {
    let numMod = 0;
    numMod += MentorQuestions.find({ moderated: false }).fetch().length;
    numMod += Reviews.find({ moderated: false }).fetch().length;
    let moderationLabel = 'Moderation';
    if (numMod > 0) {
      moderationLabel = `${moderationLabel} (${numMod})`;
    }
    const menuItems = [
      { label: 'Home', route: 'home', regex: 'home' },
      { label: 'Data Model', route: 'datamodel', regex: 'datamodel' },
      { label: 'Data Base', route: 'database', regex: 'database' },
      { label: moderationLabel, route: 'moderation', regex: 'moderation' },
      { label: 'Analytics', route: 'analytics', regex: 'analytics' },
      { label: 'Course Scoreboard', route: '/course-scoreboard', regex: 'course-scoreboard' },
    ];
    return (
      <div>
        <FirstMenuContainer/>
        <SecondMenu menuItems={menuItems} numItems={6}/>
        <Grid verticalAlign="middle" textAlign="center" container={true}>

          <Grid.Column width={4}>
            <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Admin Home</h1>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default withTracker(() => {
  const sub1 = Meteor.subscribe(AcademicPlans.getPublicationName());
  const sub2 = Meteor.subscribe(AdvisorProfiles.getPublicationName());
  const sub3 = Meteor.subscribe(CareerGoals.getPublicationName());
  const sub4 = Meteor.subscribe(Courses.getPublicationName());
  const sub5 = Meteor.subscribe(DesiredDegrees.getPublicationName());
  const sub6 = Meteor.subscribe(FacultyProfiles.getPublicationName());
  const sub7 = Meteor.subscribe(HelpMessages.getPublicationName());
  const sub8 = Meteor.subscribe(Interests.getPublicationName());
  const sub9 = Meteor.subscribe(InterestTypes.getPublicationName());
  const sub10 = Meteor.subscribe(MentorProfiles.getPublicationName());
  const sub11 = Meteor.subscribe(Opportunities.getPublicationName());
  const sub12 = Meteor.subscribe(OpportunityTypes.getPublicationName());
  const sub13 = Meteor.subscribe(PlanChoices.getPublicationName());
  const sub14 = Meteor.subscribe(Reviews.getPublicationName());
  const sub15 = Meteor.subscribe(Semesters.getPublicationName());
  const sub16 = Meteor.subscribe(StudentProfiles.getPublicationName());
  const sub17 = Meteor.subscribe(Slugs.getPublicationName());
  const sub18 = Meteor.subscribe(Teasers.getPublicationName());
  const sub19 = Meteor.subscribe(Users.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready() &&
    sub8.ready() && sub9.ready() && sub10.ready() && sub11.ready() && sub12.ready() && sub13.ready() && sub14.ready() &&
    sub15.ready() && sub16.ready() && sub17.ready() && sub18.ready() && sub19.ready(),
  };
})(AdminHome);
