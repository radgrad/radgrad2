import * as React from 'react';
import { Button, Card, Grid, Header, Icon, Segment, Tab } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { Users } from '../../../api/user/UserCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import PreferredChoice from '../../../api/degree-plan/PreferredChoice';
import { ROLE } from '../../../api/role/Role';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import ExplorerCard from './ExplorerCard';

import ProfileCard from './ProfileCard';

// eslint-disable-next-line no-unused-vars
import { IInterest, IProfile } from '../../../typings/radgrad';
import UserProfileCard from './UserProfileCard';
import TermCard from './TermCard';
import PlanCard from './PlanCard';
import { EXPLORER_TYPE, URL_ROLES } from '../../../startup/client/routes-config';
import * as Router from './RouterHelperFunctions';
import { explorerActions } from '../../../redux/shared/explorer';
import {
  ICardExplorerMenuWidgetProps, // eslint-disable-line no-unused-vars
  availableAcademicPlans,
  availableCourses,
  availableInterests,
  buildHeader,
  degrees,
  isType,
  matchingCareerGoals,
  noItems,
} from './explorer-helper-functions';

interface ICardExplorerWidgetProps extends ICardExplorerMenuWidgetProps{
  collection: any;
  reactiveSource: object[];
  reactiveSourceProfile: object;
  reactiveSourceForTermCarOne: object[];
  reactiveSourceForTermCarTwo: object[];
  dispatch: any;
  hiddenCourses: boolean;
  hiddenOpportunities: boolean;
}

const mapStateToProps = (state) => ({
  hiddenCourses: state.shared.explorer.hiddenCourses,
  hiddenOpportunities: state.shared.explorer.hiddenOpportunities,
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
 *  11. In the render() function, build the Card Explorer Card by mapping over items.
 */
class CardExplorerWidget extends React.Component
  <ICardExplorerWidgetProps> {
  constructor(props) {
    super(props);
  }

  /* ####################################### HEADER FUNCTIONS ####################################### */

   private checkForNoItems = (): Element | JSX.Element | string => {
    const { type } = this.props;
    switch (type) {
      case EXPLORER_TYPE.ACADEMICPLANS:
        return noItems('noPlan', this.props.match) ? this.buildNoItemsMessage('noPlan') : '';
      case EXPLORER_TYPE.CAREERGOALS:
        return <React.Fragment>
          {noItems('noInterests', this.props.match) ? this.buildNoItemsMessage('noInterests') : ''}
          {noItems('noCareerGoals', this.props.match) ? this.buildNoItemsMessage('noCareerGoals') : ''}
        </React.Fragment>;
      case EXPLORER_TYPE.COURSES:
        return noItems('noInterests', this.props.match) ? this.buildNoItemsMessage('noInterests') : '';
      case EXPLORER_TYPE.DEGREES:
        //  do nothing; users cannot add their own desired degrees to their profile
        return '';
      case EXPLORER_TYPE.INTERESTS:
        return noItems('noInterests', this.props.match) ? this.buildNoItemsMessage('noInterests') : '';
      case EXPLORER_TYPE.OPPORTUNITIES:
        return noItems('noInterests', this.props.match) ? this.buildNoItemsMessage('noInterests') : '';
      case EXPLORER_TYPE.USERS:
        // do nothing; we do not track if there are no users
        return '';
      default:
        return '';

    }
  }

  private buildNoItemsMessage = (noItemsMessageType): Element | JSX.Element | string => {
    switch (noItemsMessageType) {
      case 'noPlan':
        return <p>You have no Academic Plan, select add to profile to select a plan.</p>;
      case 'noInterests':
        if (isType(EXPLORER_TYPE.CAREERGOALS, this.props)) {
          return <p>Add interests to see sorted careers. To add interests, select &quot;Interests&quot; in the pull-down
            menu on the left.</p>;
        }
        if (isType(EXPLORER_TYPE.COURSES, this.props)) {
          return <p>Add interests to see sorted courses. To add interests, select &quot;Interests&quot; in the pull-down
            menu on the left.</p>;
        }
        if (isType(EXPLORER_TYPE.INTERESTS, this.props)) {
          return <p>You have no Interests, select add to profile to add an interest.</p>;
        }
        if (isType(EXPLORER_TYPE.OPPORTUNITIES, this.props)) {
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

  private getItems = (): { [key: string]: any }[] => {
    const { type } = this.props;
    switch (type) {
      case EXPLORER_TYPE.ACADEMICPLANS:
        return availableAcademicPlans(this.props.match);
      case EXPLORER_TYPE.CAREERGOALS:
        return matchingCareerGoals(this.props.match);
      case EXPLORER_TYPE.COURSES:
        return availableCourses(this.props.match);
      case EXPLORER_TYPE.DEGREES:
        return degrees();
      case EXPLORER_TYPE.INTERESTS:
        return availableInterests(this.props.match);
      case EXPLORER_TYPE.OPPORTUNITIES:
        return this.opportunities();
      case EXPLORER_TYPE.USERS:
        //  do nothing. For other Card Explorers, we only need one constant variable to hold an item array.
        //  However, we need multiple constant variables to hold the users for each of the invidual roles
        //  (faculty, advisor, etc...). See the function @getUsers(role) instead.
        return [];
      default:
        return [];
    }
  }

  // Used in both Courses and Opportunities Card Explorer
  private hiddenExists(): boolean {
    if (!Router.isUrlRoleStudent(this.props.match)) return false;

    const username = Router.getUsername(this.props.match);
    if (username) {
      const profile = Users.getProfile(username);
      let ret;
      if (isType(EXPLORER_TYPE.COURSES, this.props)) {
        ret = profile.hiddenCourseIDs.length !== 0;
      } else {
        ret = profile.hiddenOpportunityIDs.length !== 0;
      }
      return ret;
    }
    return false;
  }

  /* ####################################### COURSES HELPER FUNCTIONS ####################################### */
  private isCoursesHidden = (): boolean => this.props.hiddenCourses;

  private handleShowHiddenCourses = (e: any): void => {
    e.preventDefault();
    this.props.dispatch(explorerActions.setCardExplorerWidgetHiddenCourses(false));
  }

  private handleHideHiddenCourses = (e: any): void => {
    e.preventDefault();
    this.props.dispatch(explorerActions.setCardExplorerWidgetHiddenCourses(true));
  }

  private matchingCourses = (): object[] => {
    const username = Router.getUsername(this.props.match);
    if (username) {
      const allCourses = availableCourses(this.props.match);
      const profile = Users.getProfile(username);
      const interestIDs = Users.getInterestIDs(profile.userID);
      const preferred = new PreferredChoice(allCourses, interestIDs);
      return preferred.getOrderedChoices();
    }
    return [];
  }


  private hiddenCoursesHelper = (): object[] => {
    const username = Router.getUsername(this.props.match);
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

  private coursesItemCount = (): number => this.hiddenCoursesHelper().length;

  /* ####################################### OPPORTUNITIES HELPER FUNCTIONS ####################################### */
  private isOpportunitiesHidden = (): boolean => this.props.hiddenOpportunities;

  private handleShowHiddenOpportunities = (e: any): void => {
    e.preventDefault();
    this.props.dispatch(explorerActions.setCardExplorerWidgetHiddenOpportunities(false));
  }

  private handleHideHiddenOpportunities = (e: any): void => {
    e.preventDefault();
    this.props.dispatch(explorerActions.setCardExplorerWidgetHiddenOpportunities(true));
  }

  private opportunities = (): object[] => {
    const opportunities = this.matchingOpportunities();
    let visibleOpportunities;
    if (this.isOpportunitiesHidden()) {
      visibleOpportunities = this.hiddenOpportunitiesHelper();
    } else {
      visibleOpportunities = opportunities;
    }
    return visibleOpportunities;
  }

  private matchingOpportunities = (): object[] => {
    const allOpportunities = this.availableOpps();
    const username = Router.getUsername(this.props.match);
    const profile = Users.getProfile(username);
    const interestIDs = Users.getInterestIDs(profile.userID);
    const preferred = new PreferredChoice(allOpportunities, interestIDs);
    return preferred.getOrderedChoices();
  }

  private availableOpps = (): object[] => {
    const notRetired = Opportunities.findNonRetired({});
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    if (Router.isUrlRoleStudent(this.props.match)) {
      if (notRetired.length > 0) {
        const filteredByTerm = _.filter(notRetired, (opp) => {
          const oi = OpportunityInstances.find({
            studentID: Router.getUserIdFromRoute(this.props.match),
            opportunityID: opp._id,
          }).fetch();
          return oi.length === 0;
        });
        const filteredByInstance = _.filter(filteredByTerm, (opp) => {
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
    } else if (this.props.role === URL_ROLES.FACULTY) {
      return _.filter(notRetired, o => o.sponsorID !== Router.getUserIdFromRoute(this.props.match));
    }
    return notRetired;
  };

  private hiddenOpportunitiesHelper = (): object[] => {
    const username = Router.getUsername(this.props.match);
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

  private opportunitiesItemCount = (): number => this.hiddenOpportunitiesHelper().length;

  /* ####################################### USERS HELPER FUNCTIONS ####################################### */
  private getUsers = (role: string): IProfile[] => {
    const username = Router.getUsername(this.props.match);
    const users = Users.findProfilesWithRole(role, {}, { sort: { lastName: 1 } });

    if (username) {
      const profile = Users.getProfile(username);
      const filtered = _.filter(users, (u) => u.username !== profile.username);
      const interestIDs = Users.getInterestIDs(profile.userID);
      const preferred = new PreferredChoice(filtered, interestIDs);
      return preferred.getOrderedChoices();
    }
    return users;
  }

  private handleRoleTabClick = (e: any, { name }): void => this.setState({ activeRoleTab: name });

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
      paddingBottom: '10px',
    };
    const tabPaneStyle: React.CSSProperties = {
      overflowX: 'hidden',
      overflowY: 'hidden',
    };

    /* Variables */
    const header = buildHeader(this.props); // The header Title and Count
    const items = this.getItems(); // The items to map over
    const { type } = this.props;

    // For the Academic Plans Card Explorer
    const buildPlanCard = isType(EXPLORER_TYPE.ACADEMICPLANS, this.props);

    // For Career Goals or Interests (or any future Card Explorer that has an "Add to Profile" functionality)
    const buildProfileCard = isType(EXPLORER_TYPE.INTERESTS, this.props) || isType(EXPLORER_TYPE.CAREERGOALS, this.props);

    // For Courses or Opportunities (or any future Card Explorer that has an "Add to Plan" functionality)
    const buildTermCard = isType(EXPLORER_TYPE.COURSES, this.props) || isType(EXPLORER_TYPE.OPPORTUNITIES, this.props);
    const isCoursesHidden = this.isCoursesHidden();
    const isOpportunitiesHidden = this.isOpportunitiesHidden();
    const hiddenExists = this.hiddenExists();
    const isStudent = Router.isUrlRoleStudent(this.props.match);

    // For Degrees (or any future Card Explore that only has a "View More" functionality)
    const buildExplorerCard = isType(EXPLORER_TYPE.DEGREES, this.props);

    // For the Users Card Explorer
    const buildStudentUserCard = isType(EXPLORER_TYPE.USERS, this.props);
    const advisorRoleUsers = this.getUsers(ROLE.ADVISOR);
    const facultyRoleUsers = this.getUsers(ROLE.FACULTY);
    const mentorRoleUsers = this.getUsers(ROLE.MENTOR);
    const studentRoleUsers = this.getUsers(ROLE.STUDENT);
    const panes = [
      {
        menuItem: 'Advisors',
        render: () => <Tab.Pane key="advisors">
          <Grid stackable={true}>
            <Card.Group stackable={true} itemsPerRow={3} style={userStackableCardsStyle}>
              {advisorRoleUsers.map((ele, i) => <UserProfileCard key={i} item={ele}/>)}
            </Card.Group>
          </Grid>
        </Tab.Pane>,
      },
      {
        menuItem: 'Faculty',
        render: () => <Tab.Pane key="faculty">
          <Grid stackable={true}>
            <Card.Group stackable={true} itemsPerRow={3} style={userStackableCardsStyle}>
              {facultyRoleUsers.map((ele, i) => <UserProfileCard key={i} item={ele}/>)}
            </Card.Group>
          </Grid>
        </Tab.Pane>,
      },
      {
        menuItem: 'Mentors',
        render: () => <Tab.Pane key="mentors">
          <Grid stackable={true}>
            <Card.Group stackable={true} itemsPerRow={3} style={userStackableCardsStyle}>
              {mentorRoleUsers.map((ele, i) => <UserProfileCard key={i} item={ele}/>)}
            </Card.Group>
          </Grid>
        </Tab.Pane>,
      },
      {
        menuItem: 'Students',
        render: () => <Tab.Pane key="students">
          <Grid stackable={true}>
            <Card.Group stackable={true} itemsPerRow={3} style={userStackableCardsStyle}>
              {studentRoleUsers.map((ele, i) => <UserProfileCard key={i} item={ele}/>)}
            </Card.Group>
          </Grid>
        </Tab.Pane>,
      },
    ];

    // Certain "Adding" functinalities should only be exposed to "Student" role, not Faculty or Mentor
    const canAdd = Router.isUrlRoleStudent(this.props.match);

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

          {
            buildTermCard ?
              [
                hiddenExists ?
                  [
                    isType(EXPLORER_TYPE.COURSES, this.props) ?
                      [
                        isCoursesHidden ?
                          <Button key={_.uniqueId()} basic={true} color="green" size="mini"
                                  onClick={this.handleShowHiddenCourses}>
                            <Icon name="chevron up"/> HIDDEN <span
                            style={uppercaseTextTransformStyle}>COURSES</span>
                          </Button>
                          :
                          <Button key={_.uniqueId()} basic={true} color="green" size="mini"
                                  onClick={this.handleHideHiddenCourses}>
                            <Icon name="chevron down"/> HIDDEN <span
                            style={uppercaseTextTransformStyle}>COURSES</span>
                          </Button>,
                      ]
                      :
                      [
                        isOpportunitiesHidden ?
                          <Button key={_.uniqueId()} basic={true} color="green" size="mini"
                                  onClick={this.handleShowHiddenOpportunities}>
                            <Icon name="chevron up"/> HIDDEN <span
                            style={uppercaseTextTransformStyle}>OPPORTUNITIES</span>
                          </Button>
                          :
                          <Button key={_.uniqueId()} basic={true} color="green" size="mini"
                                  onClick={this.handleHideHiddenOpportunities}>
                            <Icon name="chevron down"/> HIDDEN <span
                            style={uppercaseTextTransformStyle}>OPPORTUNITIES</span>
                          </Button>,
                      ],
                  ]
                  : '',
              ]
              : ''
          }

          {this.checkForNoItems()}

          {
            !buildStudentUserCard ?
              <Card.Group style={cardGroupStyle} itemsPerRow={2} stackable={true}>
                {
                  buildPlanCard ?
                    items.map((item) => <PlanCard key={item._id} item={item} type={type} canAdd={canAdd}/>) : ''
                }
                {
                  buildProfileCard ?
                    items.map((item, index) => <ProfileCard key={index} item={item} type={type} canAdd={true}/>) : ''
                }
                {
                  buildTermCard ?
                    items.map((item) => <TermCard key={item._id} item={item} type={type} isStudent={isStudent}
                                                  canAdd={true}/>)
                    : ''
                }
                {
                  buildExplorerCard ?
                    items.map((item) => <ExplorerCard key={item._id} item={item} type={type}/>)
                    : ''
                }
              </Card.Group>
              :
              <Tab panes={panes} defaultActiveIndex={3} style={tabPaneStyle}/>
          }
        </Segment>
      </React.Fragment>
    );
  }
}

const CardExplorerWidgetCon = connect(mapStateToProps)(CardExplorerWidget);
const CardExplorerWidgetCont = withTracker((props) => {
  const { collection, type, match } = props;
  const username = match.params.username;
  let reactiveSource;
  if (type !== EXPLORER_TYPE.USERS) {
    reactiveSource = collection.findNonRetired({});
  } else {
    reactiveSource = Users.getProfile(username);
  }

  /* Reactive sources to make TermCard reactive */
  const reactiveSourceForTermCardOne = CourseInstances.findNonRetired({});
  const reactiveSourceForTermCarTwo = OpportunityInstances.findNonRetired({});

  /* Reactive sources to make Hiding a Course / Opportunity, ProfileCard reactive */
  const reactiveSourceProfile = Users.getProfile(username);

  return {
    reactiveSource,
    reactiveSourceForTermCardOne,
    reactiveSourceForTermCarTwo,
    reactiveSourceProfile,
  };
})(CardExplorerWidgetCon);
const CardExplorerWidgetContainer = withRouter(CardExplorerWidgetCont);

export default CardExplorerWidgetContainer;
