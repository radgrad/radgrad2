import * as React from 'react';
import { Button, Card, Grid, Header, Icon, Segment, Tab } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Roles } from 'meteor/alanning:roles';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { Users } from '../../../api/user/UserCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { ROLE } from '../../../api/role/Role';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import {
  setStudentHomeWidgetHiddenCourses,
  setStudentHomeWidgetHiddenOpportunities,
} from '../../../redux/actions/studentHomePageActions';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import ExplorerCard from './ExplorerCard';

interface ICardExplorerWidgetProps {
  collection: any;
  type: 'plans' | 'career-goals' | 'courses' | 'degrees' | 'interests' | 'opportunities' | 'users';
  role: 'student' | 'faculty' | 'mentor';
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  reactiveSource: object[];
  dispatch: any;
  hiddenCourses: boolean;
  hiddenOpportunities: boolean;
}

const mapStateToProps = (state) => ({
  hiddenCourses: state.cardExplorerPage.cardExplorerWidget.hiddenCourses,
  hiddenOpportunities: state.cardExplorerPage.cardExplorerWidget.hiddenOpportunities,
});

/**
 * Process to build a new Card Explorer Widget
 * Refer to this documentation if we're building a new Card Explorer Widget for a new type if you simply need to
 * understand how building the Card Explorer Widget is abstracted.
 * 1. Define a title in @getHeaderTitle() under a new case statement
 * 2. Build a function to get the item count for that type
 * 3. Call the function from #2 in @getHeaderCount() under a new case statement
 * 4. Build a function that calculates if the user needs to add a particular item type to their plan (returns boolean)
 * 5. Build a render message(s) in @buildNoItemsMessage('noItemsType') that tells the user that they need to add item
 *    type to their plan for each item type that they need
 * 6. Call the function(s) from #4 in @noItems() under a new case statement for each item type
 * 7. For each Card Explorer PAGE, call `@noItems('noItemsType') ? this.buildNoItemsMessage('noItemsType') : ''` for
 *    each of the noItemsType from #5 & #6. If there is more than one item type, this should be wrapped in a <React.Fragment>
 * ##Steps #1 through #7 builds the HEADER for the Card Explorer page.##
 *  8. Build the main function and any necessary helper functions to get the items to map over for that Card Explorer
 *     page.
 *  9. Call the main function from #8 under @getItems() under a new case statement for that page.
 *  10. Add a new typing for the type under ICardExplorerWidgetProps for the Card Explorer Page being built. This string
 *      should be the same as the END string of the url. (i.e. /student/:username/explorer/career-goals. In this case,
 *      career-goals is the type.)
 *  11. TODO
 */
class CardExplorerWidget extends React.Component<ICardExplorerWidgetProps> {
  constructor(props) {
    super(props);
  }

  /* ####################################### HEADER FUNCTIONS ####################################### */
  private getHeaderTitle = () => {
    const { type } = this.props;
    switch (type) {
      case 'plans':
        return 'ACADEMIC PLANS';
      case 'career-goals':
        return 'CAREER GOALS';
      case 'courses':
        return 'COURSES';
      case 'degrees':
        return 'DESIRED DEGREES';
      case 'interests':
        return 'INTERESTS';
      case 'opportunities':
        return 'OPPORTUNITIES';
      case 'users':
        return 'USERS';
      default:
        return 'UNDEFINED TITLE';
    }
  }

  private getHeaderCount = () => {
    const { type } = this.props;
    switch (type) {
      case 'plans':
        return this.academicPlansItemCount();
      case 'career-goals':
        return this.careerGoalsItemCount();
      case 'courses':
        return this.coursesItemCount();
      case 'degrees':
        return this.degreesItemCount();
      case 'interests':
        return this.interestsItemCount();
      case 'opportunities':
        return this.opportunitiesItemCount();
      case 'users':
        // do nothing; we do not track user count
        return -1;
      default:
        return -1;
    }
  }

  private buildHeader = () => {
    const header = {
      title: this.getHeaderTitle(),
      count: this.getHeaderCount(),
    };
    return header;
  }

  private checkForNoItems = () => {
    const { type } = this.props;
    switch (type) {
      case 'plans':
        return this.noItems('noPlan') ? this.buildNoItemsMessage('noPlan') : '';
      case 'career-goals':
        return <React.Fragment>
          {this.noItems('noInterests') ? this.buildNoItemsMessage('noInterests') : ''}
          {this.noItems('noCareerGoals') ? this.buildNoItemsMessage('noCareerGoals') : ''}
        </React.Fragment>;
      case 'courses':
        return this.noItems('noInterests') ? this.buildNoItemsMessage('noInterests') : '';
      case 'degrees':
        //  do nothing; users cannot add their own desired degrees to their profile
        return '';
      case 'interests':
        return this.noItems('noInterests') ? this.buildNoItemsMessage('noInterests') : '';
      case 'opportunities':
        return this.noItems('noInterests') ? this.buildNoItemsMessage('noInterests') : '';
      case 'users':
        // do nothing; we do not track if there are no users
        return '';
      default:
        return '';

    }
  }
  private noItems = (noItemsType) => {
    switch (noItemsType) {
      case 'noPlan':
        return this.noPlan();
      case 'noInterests':
        return this.noInterests();
      case 'noCareerGoals':
        return this.noCareerGoals();
      default:
        return true;
    }
  }

  private buildNoItemsMessage = (noItemsMessageType) => {
    switch (noItemsMessageType) {
      case 'noPlan':
        return <p>You have no Academic Plan, select add to profile to select a plan.</p>;
      case 'noInterests':
        if (this.isType('career-goals')) {
          return <p>Add interests to see sorted careers. To add interests, select &quot;Interests&quot; in the pull-down
            menu on the left.</p>;
        }
        if (this.isType('courses')) {
          return <p>Add interests to see sorted courses. To add interests, select &quot;Interests&quot; in the pull-down
            menu on the left.</p>;
        }
        if (this.isType('interests')) {
          return <p>You have no Interests, select add to profile to add an interest.</p>;
        }
        if (this.isType('opportunities')) {
          return <p>Add interests to see sorted opportunities. To add interests, select &quot;Interests&quot; in the
            pull-down menu on the left.</p>;
        }
        return '';
      case 'noCareerGoals':
        return <p>You have no Career Goals, select &quot;Add to Profile&quot; to add a career goal.</p>;
      default:
        return '';
    }
  }
  /* ####################################### GENERAL HELPER FUNCTIONS ####################################### */
  private isRoleStudent = () => this.props.role === 'student'

  private getUsername = () => this.props.match.params.username

  private getUserIdFromRoute = () => {
    const username = this.getUsername();
    return username && Users.getID(username);
  }

  private isType = (typeToCheck) => {
    const { type } = this.props;
    return type === typeToCheck;
  }

  private getItems = () => {
    const { type } = this.props;
    switch (type) {
      case 'plans':
        return this.availableAcademicPlans();
      case 'career-goals':
        return this.matchingCareerGoals();
      case 'courses':
        return this.courses();
      case 'degrees':
        return this.degrees();
      case 'interests':
        return this.availableInterests();
      case 'opportunities':
        return this.opportunities();
      case 'users':
        //  do nothing. For other Card Explorers, we only need one constant variable to hold an item array.
        //  However, we need multiple constant variables to hold the users for each of the invidual roles
        //  (faculty, advisor, etc...). See the function @getUsers(role) instead.
        return [];
      default:
        return [];
    }
  }

  // Used in both Courses and Opportunities Card Explorer
  private hiddenExists() {
    if (!this.isRoleStudent()) return false;

    const username = this.getUsername();
    if (username) {
      const profile = Users.getProfile(username);
      let ret;
      if (this.isType('courses')) {
        ret = profile.hiddenCourseIDs.length !== 0;
      } else {
        ret = profile.hiddenOpportunityIDs.length !== 0;
      }
      return ret;
    }
    return false;
  }

  /* ####################################### ACADEMIC PLANS HELPER FUNCTIONS ####################################### */
  private noPlan = () => {
    const username = this.getUsername();
    if (this.isRoleStudent()) {
      if (this.getUsername()) {
        return _.isNil(Users.getProfile(username).academicPlanID);
      }
    }
    return false;
  }

  private availableAcademicPlans = () => {
    let plans = AcademicPlans.findNonRetired({}, { sort: { year: 1, name: 1 } });
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      if (!profile.declaredAcademicTermID) {
        plans = AcademicPlans.getLatestPlans();
      } else {
        const declaredTerm = AcademicTerms.findDoc(profile.declaredAcademicTermID);
        plans = _.filter(AcademicPlans.find({ termNumber: { $gte: declaredTerm.termNumber } }, {
          sort: {
            year: 1,
            name: 1,
          },
        }).fetch(), (ap) => !ap.retired);
      }
      if (profile.academicPlanID) {
        return _.filter(plans, p => profile.academicPlanID !== p._id);
      }
    }
    return plans;
  }

  private academicPlansItemCount = () => this.availableAcademicPlans().length

  /* ####################################### CAREER GOALS HELPER FUNCTIONS ####################################### */
  private availableCareerGoals = () => {
    const careers = CareerGoals.find({}).fetch();
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      const careerGoalIDs = profile.careerGoalIDs;
      return _.filter(careers, c => !_.includes(careerGoalIDs, c._id));
    }
    return careers;
  }

  private matchingCareerGoals() {
    const allCareers = this.availableCareerGoals();
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      const interestIDs = Users.getInterestIDs(profile.userID);
      const preferred = new PreferredChoice(allCareers, interestIDs);
      return preferred.getOrderedChoices();
    }
    return allCareers;
  }

  private careerGoalsItemCount = () => this.matchingCareerGoals().length;

  // This is used both in Career Goals and Interests
  private noInterests = () => {
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      const interestIDs = Users.getInterestIDs(profile.userID);
      return interestIDs.length === 0;
    }
    return true;
  }

  private noCareerGoals = () => {
    if (this.getUsername()) {
      const profile = Users.getProfile(this.getUsername());
      return profile.careerGoalIDs.length === 0;
    }
    return true;
  }

  /* ####################################### COURSES HELPER FUNCTIONS ####################################### */
  private isCoursesHidden = () => this.props.hiddenCourses;

  private handleShowHiddenCourses = (e) => {
    e.preventDefault();
    this.props.dispatch(setStudentHomeWidgetHiddenCourses(false));
  }

  private handleHideHiddenCourses = (e) => {
    e.preventDefault();
    this.props.dispatch(setStudentHomeWidgetHiddenCourses(true));
  }

  private courses = () => {
    const courses = this.matchingCourses();
    let visibleCourses;
    if (this.isCoursesHidden()) {
      visibleCourses = this.hiddenCoursesHelper();
    } else {
      visibleCourses = courses;
    }
    return visibleCourses;
  };

  private matchingCourses = () => {
    const username = this.getUsername();
    if (username) {
      const allCourses = this.availableCourses();
      const profile = Users.getProfile(username);
      const interestIDs = Users.getInterestIDs(profile.userID);
      const preferred = new PreferredChoice(allCourses, interestIDs);
      return preferred.getOrderedChoices();
    }
    return [];
  }

  private availableCourses = () => {
    const courses = Courses.findNonRetired({});
    if (courses.length > 0) {
      const studentID = this.getUserIdFromRoute();
      let filtered = _.filter(courses, function filter(course) {
        if (course.number === 'ICS 499') {
          return true;
        }
        const ci = CourseInstances.find({
          studentID,
          courseID: course._id,
        }).fetch();
        return ci.length === 0;
      });
      if (Roles.userIsInRole(studentID, [ROLE.STUDENT])) {
        const profile = StudentProfiles.findDoc({ userID: studentID });
        const plan = AcademicPlans.findDoc(profile.academicPlanID);
        if (plan.coursesPerAcademicTerm.length < 15) { // not bachelors and masters
          const regex = /[1234]\d\d/g;
          filtered = _.filter(filtered, (c) => c.number.match(regex));
        }
      }
      return filtered;
    }
    return [];
  };

  private hiddenCoursesHelper = () => {
    const username = this.getUsername();
    if (username) {
      const courses = this.matchingCourses();
      let nonHiddenCourses;
      if (this.isCoursesHidden()) {
        const profile = Users.getProfile(username);
        nonHiddenCourses = _.filter(courses, (course) => {
          if (_.includes(profile.hiddenCourseIDs, course._id)) {
            return false;
          }
          return true;
        });
      } else {
        nonHiddenCourses = courses;
      }
      return nonHiddenCourses;
    }
    return [];
  }

  private coursesItemCount = () => this.hiddenCoursesHelper().length;

  /* ####################################### DEGREES HELPER FUNCTIONS ####################################### */
  private degrees = () => DesiredDegrees.findNonRetired({}, { sort: { name: 1 } });

  private degreesItemCount = () => this.degrees().length;

  /* ####################################### INTERESTS HELPER FUNCTIONS ####################################### */
  private availableInterests = () => {
    let interests = Interests.find({}).fetch();
    const username = this.getUsername();
    if (username) {
      const profile = Users.getProfile(username);
      const allInterests = Users.getInterestIDsByType(profile.userID);
      interests = _.filter(interests, i => !_.includes(allInterests[0], i._id));
      interests = _.filter(interests, i => !_.includes(allInterests[1], i._id));
    }
    return interests;
  }

  private interestsItemCount = () => this.availableInterests().length;

  /* ####################################### OPPORTUNITIES HELPER FUNCTIONS ####################################### */
  private isOpportunitiesHidden = () => this.props.hiddenOpportunities;

  private handleShowHiddenOpportunities = (e) => {
    e.preventDefault();
    this.props.dispatch(setStudentHomeWidgetHiddenOpportunities(false));
  }

  private handleHideHiddenOpportunities = (e) => {
    e.preventDefault();
    this.props.dispatch(setStudentHomeWidgetHiddenOpportunities(true));
  }

  private opportunities = () => {
    const opportunities = this.matchingOpportunities();
    let visibleOpportunities;
    if (this.isOpportunitiesHidden()) {
      visibleOpportunities = this.hiddenOpportunitiesHelper();
    } else {
      visibleOpportunities = opportunities;
    }
    return visibleOpportunities;
  }

  private matchingOpportunities = () => {
    const allOpportunities = this.availableOpps();
    const username = this.getUsername();
    const profile = Users.getProfile(username);
    const interestIDs = Users.getInterestIDs(profile.userID);
    const preferred = new PreferredChoice(allOpportunities, interestIDs);
    return preferred.getOrderedChoices();
  }

  private availableOpps = () => {
    const notRetired = Opportunities.findNonRetired({});
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    if (this.isRoleStudent()) {
      if (notRetired.length > 0) {
        const filteredByTerm = _.filter(notRetired, function filter(opp) {
          const oi = OpportunityInstances.find({
            studentID: this.getUserIdFromRoute(),
            opportunityID: opp._id,
          })
            .fetch();
          return oi.length === 0;
        });
        const filteredByInstance = _.filter(filteredByTerm, function filter(opp) {
          let inFuture = false;
          _.forEach(opp.termIDs, (termID) => {
            const term = AcademicTerms.findDoc(termID);
            if (term.termNumber >= currentTerm.termNumber) {
              inFuture = true;
            }
          });
          return inFuture;
        });
        return filteredByInstance;
      }
    } else if (this.props.role === 'faculty') {
      return _.filter(notRetired, o => o.sponsorID !== this.getUserIdFromRoute());
    }
    return notRetired;
  };

  private hiddenOpportunitiesHelper = () => {
    const username = this.getUsername();
    if (username) {
      const opportunities = this.matchingOpportunities();
      let nonHiddenOpportunities;
      if (this.isOpportunitiesHidden()) {
        const profile = Users.getProfile(username);
        nonHiddenOpportunities = _.filter(opportunities, (opp) => {
          if (_.includes(profile.hiddenOpportunityIDs, opp._id)) {
            return false;
          }
          return true;
        });
      } else {
        nonHiddenOpportunities = opportunities;
      }
      return nonHiddenOpportunities;
    }
    return [];
  }

  private opportunitiesItemCount = () => this.hiddenOpportunitiesHelper().length;

  /* ####################################### USERS HELPER FUNCTIONS ####################################### */
  private getUsers = (role) => {
    const username = this.getUsername();
    let users = Users.findProfilesWithRole(role, {}, { sort: { lastName: 1 } });
    if (role === ROLE.STUDENT) {
      users = _.filter(users, (u) => u.optedIn);
    }
    if (username) {
      const profile = Users.getProfile(username);
      const filtered = _.filter(users, (u) => u.username !== profile.username);
      const interestIDs = Users.getInterestIDs(profile.userID);
      const preferred = new PreferredChoice(filtered, interestIDs);
      return preferred.getOrderedChoices();
    }
    return users;
  }

  private handleRoleTabClick = (e, { name }) => this.setState({ activeRoleTab: name });

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    /* Styles */
    const uppercaseTextTransformStyle: React.CSSProperties = { textTransform: 'uppercase' };
    const cardGroupStyle: React.CSSProperties = {
      maxHeight: '750px',
      overflowX: 'hidden',
      overflowY: 'scroll',
      marginTop: '10px',
    };
    const userStackableCardsStyle: React.CSSProperties = {
      maxHeight: '750px',
      overflowX: 'hidden',
      overflowY: 'scroll',
      marginTop: '10px',
    };

    /* Variables */
    const header = this.buildHeader(); // The header Title and Count
    const items = this.getItems(); // The items to map over
    const { type, match } = this.props;
    // const username = this.getUsername();

    // For the Academic Plans Card Explorer
    // const buildPlanCard = this.isType('plans');
    // For Career Goals or Interests (or any future Card Explorer that has an "Add to Profile" functionality)
    // const buildProfileCard = this.isType('interests') || this.isType('career-goals');
    // For Courses or Opportunities (or any future Card Explorer that has an "Add to Plan" functionality)
    const buildTermCard = this.isType('courses') || this.isType('opportunities');
    const isCoursesHidden = this.isCoursesHidden();
    const isOpportunitiesHidden = this.isOpportunitiesHidden();
    const hiddenExists = this.hiddenExists();

    // For Degrees (or any future Card Explore that only has a "View More" functionality)
    const buildExplorerCard = this.isType('degrees');

    // For the Users Card Explorer
    const buildStudentUserCard = this.isType('users');
    // FIXME: There is currently a weird behavior where getUsers returns some sort of an Iterable. When you console log,
    //        advisorRoleUsers, etc... you get an array of objects just fine. But for some reason you cannot call .map()
    //        over it.
    // const advisorRoleUsers = this.getUsers(ROLE.ADVISOR);
    // console.log(Array.from(advisorRoleUsers).map((user, index) => console.log(user)));
    // const facultyRoleUsers = this.getUsers(ROLE.FACULTY);
    // const mentorRoleUsers = this.getUsers(ROLE.MENTOR);
    // const studentRoleUsers = this.getUsers(ROLE.STUDENT);
    const panes = [
      {
        menuItem: 'Advisors',
        pane:
          <Tab.Pane key="advisors">
            <Grid stackable={true}>
              <Card.Group stackable={true} itemsPerRow={3} style={userStackableCardsStyle}>
                {
                  // TODO
                  // Array.from(advisorRoleUsers).map((user, index) => <StudentUserCard key={index} user={user}/>)
                }
              </Card.Group>
            </Grid>
          </Tab.Pane>,
      },
      {
        menuItem: 'Faculty',
        pane:
          <Tab.Pane key="faculty">
            <Grid stackable={true}>
              <Card.Group stackable={true} itemsPerRow={3} style={userStackableCardsStyle}>
                {
                  // TODO
                  // Array.from(advisorRoleUsers).map((user, index) => <StudentUserCard key={index} user={user}/>)
                }
              </Card.Group>
            </Grid>
          </Tab.Pane>,
      },
      {
        menuItem: 'Mentors',
        pane:
          <Tab.Pane key="mentors">
            <Grid stackable={true}>
              <Card.Group stackable={true} itemsPerRow={3} style={userStackableCardsStyle}>
                {
                  // TODO
                  // Array.from(advisorRoleUsers).map((user, index) => <StudentUserCard key={index} user={user}/>)
                }
              </Card.Group>
            </Grid>
          </Tab.Pane>,
      },
      {
        menuItem: 'Students',
        pane:
          <Tab.Pane key="students">
            <Grid stackable={true}>
              <Card.Group stackable={true} itemsPerRow={3} style={userStackableCardsStyle}>
                {
                  // TODO
                  // Array.from(advisorRoleUsers).map((user, index) => <StudentUserCard key={index} user={user}/>)
                }
              </Card.Group>
            </Grid>
          </Tab.Pane>,
      },
    ];

    // Certain "Adding" functinalities should only be exposed to "Student" role, not Faculty or Mentor
    // const canAdd = this.isRoleStudent();

    return (
      <React.Fragment>
        <Segment padded={true}>
          <Header dividing={true}>
            <h4>
              {
                !buildStudentUserCard ?
                  <React.Fragment>
                    <span style={uppercaseTextTransformStyle}>{header.title} </span><WidgetHeaderNumber
                    inputValue={header.count}/>
                  </React.Fragment>
                  :
                  <span style={uppercaseTextTransformStyle}>{header.title}</span>
              }
            </h4>
          </Header>

          {this.checkForNoItems()}

          {
            !buildStudentUserCard ?
              <Card.Group style={cardGroupStyle} itemsPerRow={2} stackable={true}>
                {
                  // buildPlanCard ?
                  //   // TODO: Implement PlanCard
                  //   items.map((item, index) => <PlanCard key={index} item={item} type={type} canAdd={canAdd}
                  //                                        match={match}/>) : ''
                }
                {
                  // buildProfileCard ?
                  //   // TODO: Implement ProfileCard
                  //   items.map((item, index) => <ProfileCard key={index} item={item} type={type} canAdd={true}
                  //                                           match={match}/>) : ''
                }
                {
                  buildTermCard ?
                    [
                      [
                        hiddenExists ?
                          [
                            this.isType('courses') ?
                              [
                                isCoursesHidden ?
                                  <Button key='one' basic={true} color="green" size="mini"
                                          onClick={this.handleShowHiddenCourses}>
                                    <Icon name="chevron up"/> HIDDEN <span
                                    style={uppercaseTextTransformStyle}>COURSES</span>
                                  </Button>
                                  :
                                  <Button key='two' basic={true} color="green" size="mini"
                                          onClick={this.handleHideHiddenCourses}>
                                    <Icon name="chevron down"/> HIDDEN <span
                                    style={uppercaseTextTransformStyle}>COURSES</span>
                                  </Button>,
                              ]
                              :
                              [
                                isOpportunitiesHidden ?
                                  <Button key='one' basic={true} color="green" size="mini"
                                          onClick={this.handleShowHiddenOpportunities}>
                                    <Icon name="chevron up"/> HIDDEN <span
                                    style={uppercaseTextTransformStyle}>OPPORTUNITIES</span>
                                  </Button>
                                  :
                                  <Button key='two' basic={true} color="green" size="mini"
                                          onClick={this.handleHideHiddenOpportunities}>
                                    <Icon name="chevron down"/> HIDDEN <span
                                    style={uppercaseTextTransformStyle}>OPPORTUNITIES</span>
                                  </Button>,
                              ],
                          ]
                          : '',
                      ],
                      [
                        //   TODO: Implement TermCard (named SemesterCard in radgrad)
                        //   items.map((item, index) => <TermCard key={index} item={item} type={type} canAdd={true}
                        //                                        match={match}/>) : ''
                      ],
                    ]
                    : ''
                }
                {
                  buildExplorerCard ?
                    // TODO: Implement ExplorerCard
                    items.map((item, index) => <ExplorerCard key={index} item={item} type={type} match={match}/>)
                    : ''
                }
              </Card.Group>
              :
              <Tab panes={panes} defaultActiveIndex={3}/>
          }
        </Segment>

        {/* TODO: Add Back To Top Button. I'm not sure if we should put this in the Widget level or the Page level.
              It is currently on the widget level on the original radgrad but it doesn't even appear properly.
              It seems to only appear if you have Google Chrome DevTools window active. - Gian */}
      </React.Fragment>
    );
  }
}

const CardExplorerWidgetCon = connect(mapStateToProps)(CardExplorerWidget);
const CardExplorerWidgetContainer = withTracker((props) => {
  const { collection, type, match } = props;
  const username = match.params.username;
  // TODO: Test to make sure this is enough to make things reactive
  let reactiveSource;
  if (type !== 'users') {
    reactiveSource = collection.findNonRetired();
  } else {
    reactiveSource = Users.getProfile(username);
  }

  return {
    reactiveSource,
  };
})(CardExplorerWidgetCon);
export default CardExplorerWidgetContainer;
