import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import * as _ from 'lodash';
import { Roles } from 'meteor/alanning:roles';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import CardExplorerWidget from '../../components/shared/CardExplorerWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
// @ts-ignore
import CardExplorerMenu from '../../components/shared/CardExplorerMenu';
// eslint-disable-next-line no-unused-vars
import { IAcademicPlan, ICareerGoal, ICourse, IDesiredDegree, IInterest, IOpportunity } from '../../../typings/radgrad';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { ROLE } from '../../../api/role/Role';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import * as Router from '../../components/shared/RouterHelperFunctions';
import { EXPLORER_TYPE, URL_ROLES } from '../../../startup/client/routes-config';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';

interface ICardExplorerPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  favoritePlans: IAcademicPlan[];
  favoriteCareerGoals: ICareerGoal[];
  favoriteCourses: ICourse[];
  favoriteInterests: IInterest[];
  favoriteOpportunities: IOpportunity[];
}

const getMenuWidget = (props: ICardExplorerPageProps): JSX.Element => {
  const role = Router.getRoleByUrl(props.match);
  switch (role) {
    case URL_ROLES.STUDENT:
      return <StudentPageMenuWidget/>;
    case URL_ROLES.MENTOR:
      return <MentorPageMenuWidget/>;
    case URL_ROLES.FACULTY:
      return <FacultyPageMenuWidget/>;
    default:
      return <React.Fragment/>;
  }
};

const getCollection = (props: ICardExplorerPageProps): object => {
  const type = Router.getLastUrlParam(props.match);
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return AcademicPlans;
    case EXPLORER_TYPE.CAREERGOALS:
      return CareerGoals;
    case EXPLORER_TYPE.COURSES:
      return Courses;
    case EXPLORER_TYPE.DEGREES:
      return DesiredDegrees;
    case EXPLORER_TYPE.INTERESTS:
      return Interests;
    case EXPLORER_TYPE.OPPORTUNITIES:
      return Opportunities;
    case EXPLORER_TYPE.USERS:
      return Users;
    default:
      return {};
  }
};

const addedPlans = (props: ICardExplorerPageProps): { item: IAcademicPlan, count: number }[] => {
  const plan = [];
  if (Router.getUsername(props.match)) {
    const profile = Users.getProfile(Router.getUsername(props.match));
    const thePlan = AcademicPlans.findOne({ _id: profile.academicPlanID });
    if (thePlan) {
      plan.push({ item: thePlan, count: 1 });
    }
  }
  return plan;
};

const addedCareerGoals = (props: ICardExplorerPageProps): { item: ICareerGoal, count: number }[] => {
  const careerGoals = [];
  const allCareerGoals = CareerGoals.find({}, { sort: { name: 1 } }).fetch();
  const profile = Users.getProfile(Router.getUsername(props.match));
  _.forEach(allCareerGoals, (careerGoal) => {
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
      careerGoals.push({ item: careerGoal, count: 1 });
    }
  });
  return careerGoals;
};

const addedCourses = (props: ICardExplorerPageProps): { item: ICourse, count: number }[] => {
  let courses = [];
  const allCourses = Courses.findNonRetired({}, { sort: { shortName: 1 } });
  const userID = Router.getUserIdFromRoute(props.match);
  _.forEach(allCourses, (course) => {
    const ci = CourseInstances.find({
      studentID: userID,
      courseID: course._id,
    }).fetch();
    if (ci.length > 0) {
      if (course.shortName !== 'Non-CS Course') {
        courses.push({ item: course, count: ci.length });
      }
    }
  });
  if (Roles.userIsInRole(userID, [ROLE.STUDENT])) {
    const profile = StudentProfiles.findDoc({ userID });
    const plan = AcademicPlans.findDoc(profile.academicPlanID);
    // CAM: why are we filtering?
    if (plan.coursesPerAcademicTerm.length < 15) { // not bachelors and masters
      const regex = /[1234]\d\d/g;
      courses = _.filter(addedCourses, (c) => c.item.num.match(regex));
    }
  }
  return courses;
};

const addedDegrees = (): { item: IDesiredDegree, count: number }[] => _.map(DesiredDegrees.findNonRetired({}, { sort: { name: 1 } }), (d) => ({
  item: d,
  count: 1,
}));


const addedInterests = (props: ICardExplorerPageProps): { item: IInterest, count: number }[] => {
  const interests = [];
  if (Router.getUserIdFromRoute(props.match)) {
    const allInterests = Interests.find({}, { sort: { name: 1 } }).fetch();
    const profile = Users.getProfile(Router.getUserIdFromRoute(props.match));
    _.forEach(allInterests, (interest) => {
      if (_.includes(profile.interestIDs, interest._id)) {
        interests.push({ item: interest, count: 1 });
      }
    });
  }
  return interests;
};

const addedCareerInterests = (props: ICardExplorerPageProps): { item: IInterest, count: number }[] => {
  if (Router.getUserIdFromRoute(props.match)) {
    const profile = Users.getProfile(Router.getUserIdFromRoute(props.match));
    const allInterests = Users.getInterestIDsByType(profile.userID);
    return _.map(allInterests[1], (interest) => ({ item: Interests.findDoc(interest), count: 1 }));
  }
  return [];
};

const addedOpportunities = (props: ICardExplorerPageProps): { item: IOpportunity, count: number }[] => {
  const opportunities = [];
  const allOpportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
  const userID = Router.getUserIdFromRoute(props.match);
  const role = Router.getRoleByUrl(props.match);
  if (role === URL_ROLES.FACULTY) {
    return _.filter(allOpportunities, o => o.sponsorID === userID);
  }
  if (role === URL_ROLES.STUDENT) {
    _.forEach(allOpportunities, (opportunity) => {
      const oi = OpportunityInstances.find({
        studentID: userID,
        opportunityID: opportunity._id,
      }).fetch();
      if (oi.length > 0) {
        opportunities.push({ item: opportunity, count: oi.length });
      }
    });
  }
  return opportunities;
};

const getAddedList = (props: ICardExplorerPageProps): { item: IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity, count: number }[] => {
  const type = Router.getLastUrlParam(props.match);
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return addedPlans(props);
    case EXPLORER_TYPE.CAREERGOALS:
      return addedCareerGoals(props);
    case EXPLORER_TYPE.COURSES:
      return addedCourses(props);
    case EXPLORER_TYPE.DEGREES:
      return addedDegrees();
    case EXPLORER_TYPE.INTERESTS:
      return addedInterests(props);
    case EXPLORER_TYPE.OPPORTUNITIES:
      return addedOpportunities(props);
    case EXPLORER_TYPE.USERS: // do nothing
      return [];
    default:
      return [];
  }
};

const CardExplorerPage = (props: ICardExplorerPageProps) => {
  const menuWidget = getMenuWidget(props);

  const addedList = getAddedList(props);
  const isTypeInterest = Router.getLastUrlParam(props.match) === EXPLORER_TYPE.INTERESTS; // Only Interests takes in Career List for CardExplorerMenu
  const role = Router.getRoleByUrl(props.match);
  const collection = getCollection(props);
  const type = Router.getLastUrlParam(props.match);

    return (
      <div>
        {menuWidget}

        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={14}><HelpPanelWidget/></Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={3}>
            <CardExplorerMenu menuAddedList={addedList} type={type} role={role}
                              menuCareerList={isTypeInterest ? addedCareerInterests(props) : undefined}
            />
          </Grid.Column>

          <Grid.Column width={11}>
            <CardExplorerWidget collection={collection} type={type} role={role}/>
          </Grid.Column>
          <Grid.Column width={1}/>
        </Grid.Row>
      </Grid>
      <BackToTopButton/>
    </div>
  );
};

export default withRouter(withTracker((props) => {
  const studentID = Router.getUserIdFromRoute(props.match);
  const favoritePlans = FavoriteAcademicPlans.findNonRetired({ studentID });
  const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ studentID });
  const favoriteCourses = FavoriteCourses.findNonRetired({ studentID });
  const favoriteInterests = FavoriteInterests.findNonRetired({ studentID });
  const favoriteOpportunities = FavoriteOpportunities.findNonRetired({ studentID });
  return {
    favoritePlans,
    favoriteCareerGoals,
    favoriteCourses,
    favoriteInterests,
    favoriteOpportunities,
  };
})(CardExplorerPage));
