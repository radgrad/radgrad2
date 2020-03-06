import React from 'react';
import { Card, Grid, Header, Segment, Tab } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import ExplorerCard from './ExplorerCard';

import ProfileCard from './ProfileCard';

import UserProfileCard from './UserProfileCard';
import TermCard from './TermCard';
import PlanCard from './PlanCard';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import * as Router from './RouterHelperFunctions';
import {
  ICardExplorerMenuWidgetProps,
  buildHeader,
  checkForNoItems,
  getItems,
  getUsers,
  isType,
} from './explorer-helper-functions';
import { cardExplorerWidget } from './shared-widget-names';
import CourseFilterWidget, { courseFilterKeys } from './CourseFilterWidget';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import PreferedChoice from '../../../api/degree-plan/PreferredChoice';
import OpportunitySortWidget, { opportunitySortKeys } from './OpportunitySortWidget';

interface ICardExplorerWidgetProps extends ICardExplorerMenuWidgetProps {
  collection: any;
  reactiveSource: object[];
  reactiveSourceProfile: object;
  reactiveSourceForTermCarOne: object[];
  reactiveSourceForTermCarTwo: object[];
  dispatch: any;
  hiddenCourses: boolean;
  hiddenOpportunities: boolean;
  menuList: object[];
}

interface ICardExplorerWidgetState {
  filterCoursesChoice: string;
  sortOpportunitiesChoice: string;
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
class CardExplorerWidget extends React.Component<ICardExplorerWidgetProps, ICardExplorerWidgetState> {
  constructor(props) {
    super(props);
    // console.log('CardExplorerWidget', props);
    this.state = {
      filterCoursesChoice: courseFilterKeys.none,
      sortOpportunitiesChoice: opportunitySortKeys.alphabetic,
    };
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
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
    let items = getItems(this.props); // The items to map over
    const { type } = this.props;

// For the Academic Plans Card Explorer
    const buildPlanCard = isType(EXPLORER_TYPE.ACADEMICPLANS, this.props);

// For Career Goals or Interests (or any future Card Explorer that has an "Add to Profile" functionality)
    const buildProfileCard = isType(EXPLORER_TYPE.INTERESTS, this.props) || isType(EXPLORER_TYPE.CAREERGOALS, this.props);
    if (isType(EXPLORER_TYPE.CAREERGOALS, this.props)) {
      // sort items by interest match
      const userID = Router.getUserIdFromRoute(this.props.match);
      const favorites = FavoriteInterests.findNonRetired({ userID });
      const interestIDs = _.map(favorites, (f) => f.interestID);
      const preferred = new PreferedChoice(items, interestIDs);
      items = preferred.getOrderedChoices();
    }
// For Courses or Opportunities (or any future Card Explorer that has an "Add to Plan" functionality)
    const buildTermCard = isType(EXPLORER_TYPE.COURSES, this.props) || isType(EXPLORER_TYPE.OPPORTUNITIES, this.props);
    const isCourseExplorer = isType(EXPLORER_TYPE.COURSES, this.props);
    if (isCourseExplorer) {
      items = _.sortBy(items, (item) => item.num);
      switch (this.state.filterCoursesChoice) {
        case courseFilterKeys.threeHundredPLus:
          items = _.filter(items, (i) => {
            const courseNumber = parseInt(i.num.split(' ')[1], 10);
            return courseNumber >= 300;
          });
          break;
        case courseFilterKeys.fourHundredPlus:
          items = _.filter(items, (i) => {
            const courseNumber = parseInt(i.num.split(' ')[1], 10);
            return courseNumber >= 400;
          });
          break;
        case courseFilterKeys.sixHundredPlus:
          items = _.filter(items, (i) => {
            const courseNumber = parseInt(i.num.split(' ')[1], 10);
            return courseNumber >= 600;
          });
          break;
        default:
          // do no filtering
      }
    }
    const isOpportunityExplorer = isType(EXPLORER_TYPE.OPPORTUNITIES, this.props);
    if (isOpportunityExplorer) {
      switch (this.state.sortOpportunitiesChoice) {
        case opportunitySortKeys.match:
          // eslint-disable-next-line no-case-declarations
          const userID = Router.getUserIdFromRoute(this.props.match);
          // eslint-disable-next-line no-case-declarations
          const favorites = FavoriteInterests.findNonRetired({ userID });
          // eslint-disable-next-line no-case-declarations
          const interestIDs = _.map(favorites, (f) => f.interestID);
          // eslint-disable-next-line no-case-declarations
          const preferred = new PreferedChoice(items, interestIDs);
          items = preferred.getOrderedChoices();
          break;
        case opportunitySortKeys.innovation:
          items = _.sortBy(items, (item) => -item.ice.i);
          break;
        case opportunitySortKeys.experience:
          items = _.sortBy(items, (item) => -item.ice.e);
          break;
        default:
          items = _.sortBy(items, (item) => item.name);
      }
    }
    const isStudent = Router.isUrlRoleStudent(this.props.match);

// For Degrees (or any future Card Explore that only has a "View More" functionality)
    const buildExplorerCard = isType(EXPLORER_TYPE.DEGREES, this.props);

// For the Users Card Explorer
    const buildStudentUserCard = isType(EXPLORER_TYPE.USERS, this.props);
    const advisorRoleUsers = getUsers(ROLE.ADVISOR, this.props.match);
    const facultyRoleUsers = getUsers(ROLE.FACULTY, this.props.match);
    const mentorRoleUsers = getUsers(ROLE.MENTOR, this.props.match);
    const studentRoleUsers = getUsers(ROLE.STUDENT, this.props.match);
    const panes = [
      {
        menuItem: 'Advisors',
        // eslint-disable-next-line react/display-name
        render: () => (
          <Tab.Pane key="advisors">
            <Grid stackable>
              <Card.Group stackable itemsPerRow={3} style={userStackableCardsStyle}>
                {advisorRoleUsers.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
              </Card.Group>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Faculty',
        // eslint-disable-next-line react/display-name
        render: () => (
          <Tab.Pane key="faculty">
            <Grid stackable>
              <Card.Group stackable itemsPerRow={3} style={userStackableCardsStyle}>
                {facultyRoleUsers.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
              </Card.Group>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Mentors',
        // eslint-disable-next-line react/display-name
        render: () => (
          <Tab.Pane key="mentors">
            <Grid stackable>
              <Card.Group stackable itemsPerRow={3} style={userStackableCardsStyle}>
                {mentorRoleUsers.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
              </Card.Group>
            </Grid>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Students',
        // eslint-disable-next-line react/display-name
        render: () => (
          <Tab.Pane key="students">
            <Grid stackable>
              <Card.Group stackable itemsPerRow={3} style={userStackableCardsStyle}>
                {studentRoleUsers.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
              </Card.Group>
            </Grid>
          </Tab.Pane>
        ),
      },
    ];

// Certain "Adding" functinalities should only be exposed to "Student" role, not Faculty or Mentor
    const canAdd = Router.isUrlRoleStudent(this.props.match);

    return (
      <React.Fragment>
        <Segment padded id={`${cardExplorerWidget}`}>
          <Header dividing>
            <h4>
              {
                !buildStudentUserCard ? (
                  <React.Fragment>
                    <span style={uppercaseTextTransformStyle}>
                      {header.title}
                      {' '}
                    </span>
                    <WidgetHeaderNumber
                      inputValue={header.count}
                    />
                  </React.Fragment>
                  )
                  :
                  <span style={uppercaseTextTransformStyle}>{header.title}</span>
              }
            </h4>
          </Header>

          {checkForNoItems(this.props)}
          {isCourseExplorer ?
            (
              <CourseFilterWidget
                filterChoice={this.state.filterCoursesChoice}
                handleChange={(key, value) => {
                  this.setState({ filterCoursesChoice: value });
                }}
              />
            ) : ''}
          {isOpportunityExplorer ? (
            <OpportunitySortWidget
              sortChoice={this.state.sortOpportunitiesChoice}
              handleChange={(key, value) => {
                this.setState({ sortOpportunitiesChoice: value });
              }}
            />
          ) : ''}
          {
            !buildStudentUserCard ? (
              <Card.Group style={cardGroupStyle} itemsPerRow={2} stackable>
                {
                    buildPlanCard ?
                      items.map((item) => <PlanCard key={item._id} item={item} type={type} canAdd={canAdd} />) : ''
                }
                {
                    buildProfileCard ?
                      items.map((item) => <ProfileCard key={item._id} item={item} type={type} canAdd />) : ''
                  }
                {
                    buildTermCard ?
                      items.map((item) => (
                        <TermCard
                          key={item._id}
                          item={item}
                          type={type}
                          isStudent={isStudent}
                          canAdd
                        />
                      ))
                      : ''
                  }
                {
                    buildExplorerCard ?
                      items.map((item) => <ExplorerCard key={item._id} item={item} type={type} />)
                      : ''
                  }
              </Card.Group>
              )
              :
              <Tab panes={panes} defaultActiveIndex={3} style={tabPaneStyle} />
          }
        </Segment>
      </React.Fragment>
    );
  }
}

const CardExplorerWidgetCon = connect(mapStateToProps)(CardExplorerWidget);
const CardExplorerWidgetCont = withTracker((props) => {
  const { collection, type, match, menuList } = props;
  const favoriteIDs = _.map(menuList, (m) => m.item._id);
  const username = match.params.username;
  let reactiveSource;
  if (type !== EXPLORER_TYPE.USERS) {
    const allItems = collection.findNonRetired({});
    reactiveSource = _.filter(allItems, (item) => _.includes(favoriteIDs, item._id));
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
