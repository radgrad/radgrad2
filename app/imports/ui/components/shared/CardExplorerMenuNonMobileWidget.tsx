import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Menu, Header, Responsive } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as Router from './RouterHelperFunctions';
import {
  IAcademicPlan, // eslint-disable-line no-unused-vars
  ICareerGoal, // eslint-disable-line no-unused-vars
  ICourse, // eslint-disable-line no-unused-vars
  IDesiredDegree, IFavoriteAcademicPlan, IFavoriteCareerGoal, IFavoriteCourse, IFavoriteInterest, IFavoriteOpportunity, // eslint-disable-line no-unused-vars
  IInterest, // eslint-disable-line no-unused-vars
  IOpportunity, // eslint-disable-line no-unused-vars
} from '../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import ExplorerMenuNonMobileItem from './ExplorerMenuNonMobileItem';
import {
  ICardExplorerMenuWidgetProps, // eslint-disable-line no-unused-vars
  isType,
} from './explorer-helper-functions';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';

interface ICardExplorerMenuNonMobileWidgetProps extends ICardExplorerMenuWidgetProps {
  favoriteAcademicPlans: IFavoriteAcademicPlan[];
  favoriteCareerGoals: IFavoriteCareerGoal[];
  favoriteCourses: IFavoriteCourse[];
  favoriteInterests: IFavoriteInterest[];
  favoriteOpportunities: IFavoriteOpportunity[];
}

const CardExplorerMenuNonMobileWidget = (props: ICardExplorerMenuNonMobileWidgetProps) => {
  // console.log('CardExplorerMenuNonMobile', props);
  const { menuAddedList, menuCareerList } = props;
  const adminEmail = 'radgrad@hawaii.edu';
  return (
    <React.Fragment>
      {/* ####### The Menu underneath the Dropdown for NON mobile  ####### */}
      {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. However,
            FACULTY or MENTORS have a 'Suggest a Opportunity / Career Goal' mailto link. */}
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        {
          isType(EXPLORER_TYPE.ACADEMICPLANS, props) ?
            <React.Fragment>
              <Menu vertical={true} text={true}>
                <Header as="h4" dividing={true}>MY FAVORITE ACADEMIC PLAN</Header>
                {
                  menuAddedList.map((listItem, index) => (
                    <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.ACADEMICPLANS} key={index}
                                               match={props.match}/>
                  ))
                }
              </Menu>
            </React.Fragment>
            : ''
        }

        {
          isType(EXPLORER_TYPE.COURSES, props) ?
            <React.Fragment>
              <Menu vertical={true} text={true}>
                <Header as="h4" dividing={true}>MY FAVORITE COURSES</Header>
                {
                  menuAddedList.map((listItem, index) => (
                    <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.COURSES} key={index}
                                               match={props.match}/>
                  ))
                }
              </Menu>
            </React.Fragment>
            : ''
        }

        {
          isType(EXPLORER_TYPE.OPPORTUNITIES, props) ?
            <React.Fragment>
              <a href={`mailto:${adminEmail}?subject=New Opportunity Suggestion`}>Suggest a new Opportunity</a>
              <Menu vertical={true} text={true}>
                <Header as="h4" dividing={true}>MY FAVORITE OPPORTUNITIES</Header>
                {
                  menuAddedList.map((listItem, index) => (
                    <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.OPPORTUNITIES} key={index}
                                               match={props.match}/>
                  ))
                }
              </Menu>
            </React.Fragment>
            : ''
        }

        {/* Components renderable to STUDENTS, FACULTY, and MENTORS. But if we are FACULTY or MENTORS, make sure we
                don't map over menuAddedList or else we get undefined error. */}
        {
          isType(EXPLORER_TYPE.INTERESTS, props) ?
            <Menu vertical={true} text={true}>
              <a href={`mailto:${adminEmail}?subject=New Interest Suggestion`}>Suggest a new Interest</a>
              <Header as="h4" dividing={true}>MY FAVORITE INTERESTS</Header>
              {
                menuAddedList.map((listItem, index) => (
                  <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.INTERESTS} key={index}
                                             match={props.match}/>
                ))
              }

              <Header as="h4" dividing={true}>CAREER GOAL INTERESTS</Header>
              {
                menuCareerList.map((listItem, index) => (
                  <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.INTERESTS} key={index}
                                             match={props.match}/>
                ))
              }
            </Menu>
            : ''
        }

        {
          isType(EXPLORER_TYPE.CAREERGOALS, props) ?
            <Menu vertical={true} text={true}>
              <a href={`mailto:${adminEmail}?subject=New Career Goal Suggestion`}>Suggest a new Career Goal</a>
              <Header as="h4" dividing={true}>MY FAVORITE CAREER GOALS</Header>
              {
                menuAddedList.map((listItem, index) => (
                  <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.CAREERGOALS} key={index}
                                             match={props.match}/>
                ))
              }
            </Menu>
            : ''
        }
      </Responsive>
    </React.Fragment>
  );
};

export const CardExplorerMenuNonMobileWidgetCon = withTracker((props) => {
  const studentID = Router.getUserIdFromRoute(props.match);
  const favoriteAcademicPlans = FavoriteAcademicPlans.findNonRetired({ studentID });
  const favoriteCareerGoals = FavoriteCareerGoals.findNonRetired({ studentID });
  const favoriteCourses = FavoriteCourses.findNonRetired({ studentID });
  const favoriteInterests = FavoriteInterests.findNonRetired({ studentID });
  const favoriteOpportunities = FavoriteOpportunities.findNonRetired({ studentID });
  return {
    favoriteAcademicPlans,
    favoriteCareerGoals,
    favoriteCourses,
    favoriteInterests,
    favoriteOpportunities,
  };
})(CardExplorerMenuNonMobileWidget);
export const CardExplorerMenuNonMobileWidgetContainer = withRouter(CardExplorerMenuNonMobileWidgetCon);
export default CardExplorerMenuNonMobileWidgetContainer;
