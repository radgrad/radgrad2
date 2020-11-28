import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Card, Header, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams, useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { CourseInstances } from '../../../../../api/course/CourseInstanceCollection';
import { FavoriteInterests } from '../../../../../api/favorite/FavoriteInterestCollection';
import { OpportunityInstances } from '../../../../../api/opportunity/OpportunityInstanceCollection';
import PreferedChoice from '../../../../../api/degree-plan/PreferredChoice';
import { ROLE } from '../../../../../api/role/Role';
import { Users } from '../../../../../api/user/UserCollection';
import { IAdvisorOrFacultyProfile, IStudentProfile } from '../../../../../typings/radgrad';
import { RootState } from '../../../../../redux/types';
import { scrollPositionActions } from '../../../../../redux/shared/scrollPosition';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import ProfileCard from './ProfileCard';
import TermCard from './TermCard';
import AcademicPlanCard from './AcademicPlanCard';
import CourseFilterWidget, { courseFilterKeys } from './CourseFilterWidget';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import * as Router from '../../utilities/router';
import {
  ICardExplorerMenuWidgetProps,
  buildHeader,
  checkForNoItems,
  getItems,
  isType, IExplorerTypes,
} from '../utilities/explorer';
import { cardExplorerWidget } from '../../shared-widget-names';

// TODO This is one messed up component. It needs to be refactored.

interface ICardExplorerWidgetProps extends ICardExplorerMenuWidgetProps {
  // eslint-disable-next-line react/no-unused-prop-types
  collection: any;
  // eslint-disable-next-line react/no-unused-prop-types
  reactiveSource: unknown[];
  // eslint-disable-next-line react/no-unused-prop-types
  reactiveSourceProfile: unknown;
  // eslint-disable-next-line react/no-unused-prop-types
  reactiveSourceForTermCarOne: unknown[];
  // eslint-disable-next-line react/no-unused-prop-types
  reactiveSourceForTermCarTwo: unknown[];
  // eslint-disable-next-line react/no-unused-prop-types
  studentProfiles: IStudentProfile[];
  // eslint-disable-next-line react/no-unused-prop-types
  advisorProfiles: IAdvisorOrFacultyProfile[];
  // eslint-disable-next-line react/no-unused-prop-types
  facultyProfiles: IAdvisorOrFacultyProfile[];
  // eslint-disable-next-line react/no-unused-prop-types
  menuList: unknown[];
  type: IExplorerTypes;
  // Saving Scroll Position
  plansScrollPosition: number;
  careerGoalsScrollPosition: number;
  coursesScrollPosition: number;
  interestsScrollPosition: number;
  opportunitiesScrollPosition: number;
  setPlansScrollPosition: (scrollPosition: number) => any;
  setCareerGoalsScrollPosition: (scrollPosition: number) => any;
  setCoursesScrollPosition: (scrollPosition: number) => any;
  setInterestsScrollPosition: (scrollPosition: number) => any;
  setOpportunitiesScrollPosition: (scrollPosition: number) => any;
}

const mapStateToProps = (state: RootState) => ({
  plansScrollPosition: state.shared.scrollPosition.explorer.plans,
  careerGoalsScrollPosition: state.shared.scrollPosition.explorer.careerGoals,
  coursesScrollPosition: state.shared.scrollPosition.explorer.courses,
  interestsScrollPosition: state.shared.scrollPosition.explorer.interests,
  opportunitiesScrollPosition: state.shared.scrollPosition.explorer.opportunities,
});

const mapDispatchToProps = (dispatch) => ({
  setPlansScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerPlansScrollPosition(scrollPosition)),
  setCareerGoalsScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerCareerGoalsScrollPosition(scrollPosition)),
  setCoursesScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerCoursesScrollPosition(scrollPosition)),
  setInterestsScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerInterestsScrollPosition(scrollPosition)),
  setOpportunitiesScrollPosition: (scrollPosition: number) => dispatch(scrollPositionActions.setExplorerOpportunitiesScrollPosition(scrollPosition)),
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
const ExplorerMultipleItemsWidget = (props: ICardExplorerWidgetProps) => {
  // console.log('ExplorerMultipleItemsWidget', props);
  const [filterCoursesChoiceState, setFilterCoursesChoice] = useState(courseFilterKeys.none);

  /* Styles */
  const uppercaseTextTransformStyle: React.CSSProperties = { textTransform: 'uppercase' };
  const cardGroupStyle: React.CSSProperties = {
    maxHeight: '750px',
    overflowX: 'hidden',
    overflowY: 'scroll',
    marginTop: '10px',
  };

  /* Variables */
  const match = useRouteMatch();
  const header = buildHeader(props, match); // The header Title and Count
  let items = getItems(props, match); // The items to map over
  const { type } = props;
// For the Academic Plans Card Explorer
  const buildPlanCard = isType(EXPLORER_TYPE.ACADEMICPLANS, type);

// For Career Goals or Interests (or any future Card Explorer that has an "Add to Profile" functionality)
  const buildProfileCard = isType(EXPLORER_TYPE.INTERESTS, type) || isType(EXPLORER_TYPE.CAREERGOALS, type);
  if (isType(EXPLORER_TYPE.CAREERGOALS, type)) {
    // sort items by interest match
    const userID = Router.getUserIdFromRoute(match);
    const favorites = FavoriteInterests.findNonRetired({ userID });
    const interestIDs = _.map(favorites, (f) => f.interestID);
    const preferred = new PreferedChoice(items, interestIDs);
    items = preferred.getOrderedChoices();
  }
// For Courses or Opportunities (or any future Card Explorer that has an "Add to Plan" functionality)
  const buildTermCard = isType(EXPLORER_TYPE.COURSES, type) || isType(EXPLORER_TYPE.OPPORTUNITIES, type);
  const isCourseExplorer = isType(EXPLORER_TYPE.COURSES, type);
  if (isCourseExplorer) {
    items = _.sortBy(items, (item) => item.num);
    switch (filterCoursesChoiceState) {
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

  const isStudent = Router.isUrlRoleStudent(match);

  // Certain "Adding" functinalities should only be exposed to "Student" role, not Faculty
  const canAdd = Router.isUrlRoleStudent(match);
  // Saving Scroll Position
  const { plansScrollPosition, careerGoalsScrollPosition, coursesScrollPosition, interestsScrollPosition, opportunitiesScrollPosition } = props;
  const { setPlansScrollPosition, setCareerGoalsScrollPosition, setCoursesScrollPosition, setInterestsScrollPosition, setOpportunitiesScrollPosition } = props;
  const cardExplorerCardGroupElement: HTMLElement = document.getElementById('cardExplorerCardGroupElement');
  useEffect(() => {
    let savedScrollPosition;
    if (type === EXPLORER_TYPE.ACADEMICPLANS) {
      savedScrollPosition = plansScrollPosition;
    } else if (type === EXPLORER_TYPE.CAREERGOALS) {
      savedScrollPosition = careerGoalsScrollPosition;
    } else if (type === EXPLORER_TYPE.COURSES) {
      savedScrollPosition = coursesScrollPosition;
    } else if (type === EXPLORER_TYPE.INTERESTS) {
      savedScrollPosition = interestsScrollPosition;
    } else if (type === EXPLORER_TYPE.OPPORTUNITIES) {
      savedScrollPosition = opportunitiesScrollPosition;
    }
    if (savedScrollPosition && cardExplorerCardGroupElement) {
      cardExplorerCardGroupElement.scrollTo(0, savedScrollPosition);
    }

    return () => {
      if (cardExplorerCardGroupElement) {
        const currentScrollPosition = cardExplorerCardGroupElement.scrollTop;
        if (type === EXPLORER_TYPE.ACADEMICPLANS) {
          setPlansScrollPosition(currentScrollPosition);
        } else if (type === EXPLORER_TYPE.CAREERGOALS) {
          setCareerGoalsScrollPosition(currentScrollPosition);
        } else if (type === EXPLORER_TYPE.COURSES) {
          setCoursesScrollPosition(currentScrollPosition);
        } else if (type === EXPLORER_TYPE.INTERESTS) {
          setInterestsScrollPosition(currentScrollPosition);
        } else if (type === EXPLORER_TYPE.OPPORTUNITIES) {
          setOpportunitiesScrollPosition(currentScrollPosition);
        }
      }
    };
  }, [cardExplorerCardGroupElement, careerGoalsScrollPosition, coursesScrollPosition, interestsScrollPosition, opportunitiesScrollPosition, plansScrollPosition, setCareerGoalsScrollPosition, setCoursesScrollPosition, setInterestsScrollPosition, setOpportunitiesScrollPosition, setPlansScrollPosition, type]);

  return (
    <React.Fragment>
      <Segment padded id={`${cardExplorerWidget}`}>
        <Header dividing>
          <h4>
            <React.Fragment>
              <span style={uppercaseTextTransformStyle}>{header.title} </span>
              <WidgetHeaderNumber inputValue={header.count} />
            </React.Fragment>
          </h4>
        </Header>

        {checkForNoItems(match, type)}
        {isCourseExplorer ?
          (
            <CourseFilterWidget
              filterChoice={filterCoursesChoiceState}
              handleChange={(key, value) => {
                setFilterCoursesChoice(value);
              }}
            />
          ) : ''}

        <Card.Group style={cardGroupStyle} itemsPerRow={2} stackable id="cardExplorerCardGroupElement">
          {
            buildPlanCard ?
              items.map((item) => <AcademicPlanCard key={item._id} item={item} type={type} canAdd={canAdd} />) : ''
          }
          {
            buildProfileCard ?
              items.map((item) => <ProfileCard key={item._id} item={item} type={type} canAdd />) : ''
          }
          {
            buildTermCard ?
              items.map((item) => (
                <TermCard key={item._id} item={item} type={type} isStudent={isStudent} canAdd />
              ))
              : ''
          }
        </Card.Group>
      </Segment>
    </React.Fragment>
  );
};

const CardExplorerWidgetCon = withTracker((props) => {
  const { collection, menuList } = props;
  const favoriteIDs = _.map(menuList, (m) => m.item._id);
  const { username } = useParams();
  const allItems = collection.findNonRetired({});
  const reactiveSource = _.filter(allItems, (item) => _.includes(favoriteIDs, item._id));

  /* Reactive sources to make TermCard reactive */
  const reactiveSourceForTermCardOne = CourseInstances.findNonRetired({});
  const reactiveSourceForTermCarTwo = OpportunityInstances.findNonRetired({});

  /* Reactive sources to make Hiding a Course / Opportunity, ProfileCard reactive */
  const reactiveSourceProfile = Users.getProfile(username);

  /* Reactuve sources to make Users Explorer Cards reactive */
  const studentProfiles: IStudentProfile[] = Users.findProfilesWithRole(ROLE.STUDENT, {}, {});
  const advisorProfiles: IAdvisorOrFacultyProfile[] = Users.findProfilesWithRole(ROLE.ADVISOR, {}, {});
  const facultyProfiles: IAdvisorOrFacultyProfile[] = Users.findProfilesWithRole(ROLE.FACULTY, {}, {});

  return {
    reactiveSource,
    reactiveSourceForTermCardOne,
    reactiveSourceForTermCarTwo,
    reactiveSourceProfile,
    studentProfiles,
    advisorProfiles,
    facultyProfiles,
  };
})(ExplorerMultipleItemsWidget);
const CardExplorerWidgetContainer = connect(mapStateToProps, mapDispatchToProps)(CardExplorerWidgetCon);

export default CardExplorerWidgetContainer;
