import React from 'react';
import { Card, Header, Segment } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import WidgetHeaderNumber from '../../../../components/shared/WidgetHeaderNumber';
import StudentOfInterestCard from './StudentOfInterestCard';
import { Users } from '../../../../../api/user/UserCollection';
import { Interests } from '../../../../../api/interest/InterestCollection';
import { OpportunityInstances } from '../../../../../api/opportunity/OpportunityInstanceCollection';
import { Courses } from '../../../../../api/course/CourseCollection';
import { CourseInstances } from '../../../../../api/course/CourseInstanceCollection';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { EXPLORER_TYPE } from '../../../../../startup/client/route-constants';
import * as Router from '../../../../components/shared/RouterHelperFunctions';
import { getUsername } from '../../../../components/shared/RouterHelperFunctions';
import { recommendedCourses, recommendedOpportunities } from '../../../../components/student/student-widget-names';
import { ICourse, IFavoriteCareerGoal, IFavoriteInterest, IOpportunity } from '../../../../../typings/radgrad';
import { FavoriteInterests } from '../../../../../api/favorite/FavoriteInterestCollection';
import { FavoriteCareerGoals } from '../../../../../api/favorite/FavoriteCareerGoalCollection';
import { Opportunities } from '../../../../../api/opportunity/OpportunityCollection';
import PreferredChoice from '../../../../../api/degree-plan/PreferredChoice';

interface IStudentOfInterestWidgetProps {
  type: string;
  // eslint-disable-next-line react/no-unused-prop-types
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  // eslint-disable-next-line react/no-unused-prop-types
  profile: any;
  // eslint-disable-next-line react/no-unused-prop-types
  nonRetiredCourses: ICourse[];
  // eslint-disable-next-line react/no-unused-prop-types
  nonRetiredOpportunities: IOpportunity[];
}

const isTypeCourse = (props: IStudentOfInterestWidgetProps): boolean => props.type === EXPLORER_TYPE.COURSES;

const availableCourses = (props: IStudentOfInterestWidgetProps) => {
  const { nonRetiredCourses } = props;
  if (nonRetiredCourses.length > 0) {
    return _.filter(nonRetiredCourses, (course: any) => {
      if (course.num === 'ICS 499') { // TODO: hardcoded ICS string
        return true;
      }
      const ci = CourseInstances.findNonRetired({
        studentID: Router.getUserIdFromRoute(props.match),
        courseID: course._id,
      });
      return ci.length === 0;
    });
  }
  return [];
};

const matchingCourses = (props: IStudentOfInterestWidgetProps) => {
  const username = Router.getUsername(props.match);
  if (username) {
    const allCourses = availableCourses(props);
    const matching: any = [];
    const { profile } = props;
    const userInterests = [];
    let courseInterests = [];
    _.forEach(Users.getInterestIDs(profile.userID), (id) => {
      userInterests.push(Interests.findDoc(id));
    });
    _.forEach(allCourses, (course) => {
      courseInterests = [];
      _.forEach(course.interestIDs, (id) => {
        courseInterests.push(Interests.findDoc(id));
        _.forEach(courseInterests, (courseInterest) => {
          _.forEach(userInterests, (userInterest) => {
            if (_.isEqual(courseInterest, userInterest)) {
              if (!_.includes(matching, course)) {
                matching.push(course);
              }
            }
          });
        });
      });
    });
    // Only display up to the first six matches.
    return (matching < 7) ? matching : matching.slice(0, 6);
  }
  return [];
};

const availableOpps = (props: IStudentOfInterestWidgetProps) => {
  const { nonRetiredOpportunities } = props;
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  if (nonRetiredOpportunities.length > 0) {
    const filteredByTerm = _.filter(nonRetiredOpportunities, (opp: any) => {
      const oi = OpportunityInstances.findNonRetired({
        studentID: Router.getUserIdFromRoute(props.match),
        opportunityID: opp._id,
      });
      return oi.length === 0;
    });
    return _.filter(filteredByTerm, (opp) => {
      let inFuture = false;
      _.forEach(opp.termIDs, (termID) => {
        const term = AcademicTerms.findDoc(termID);
        if (term.termNumber >= currentTerm.termNumber) {
          inFuture = true;
        }
      });
      return inFuture;
    });
  }
  return [];
};

const matchingOpportunities = (props: IStudentOfInterestWidgetProps) => {
  const allOpportunities = availableOpps(props);
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  const interestIDs = Users.getInterestIDs(profile.userID);
  const preferred = new PreferredChoice(allOpportunities, interestIDs);
  const matching = preferred.getOrderedChoices();
  return (matching.length < 7) ? matching : matching.slice(0, 6);
};

const itemCount = (props: IStudentOfInterestWidgetProps) => {
  let ret;
  if (isTypeCourse(props)) {
    ret = matchingCourses(props).length;
  } else {
    ret = matchingOpportunities(props).length;
  }
  return ret;
};

const StudentOfInterestWidget = (props: IStudentOfInterestWidgetProps) => {
  /*
   Had to declare the styles as React.CSSProperties to fix the "Type X is not assignable to Type Y" errors
   See https://github.com/microsoft/TypeScript/issues/11465#issuecomment-252453037
   */
  const uppercaseTextTransformStyle: React.CSSProperties = { textTransform: 'uppercase' };
  const cardsStackableStyle: React.CSSProperties = {
    maxHeight: '500px',
    overflowY: 'auto',
    padding: '5px',
  };

  const { type } = props;
  let id: string;
  if (type === 'opportunities') {
    id = recommendedOpportunities;
  } else {
    id = recommendedCourses;
  }
  const courses = matchingCourses(props);
  const opportunities = matchingOpportunities(props);

  return (
    <Segment padded id={id}>
      <Header dividing>
        <h4>
          RECOMMENDED
          <span style={uppercaseTextTransformStyle}> {type}</span> <WidgetHeaderNumber inputValue={itemCount(props)} />
        </h4>
      </Header>

      {isTypeCourse(props)
        ? (courses.length > 0)
          ? (
            <div style={cardsStackableStyle}>
              <Card.Group stackable itemsPerRow={2}>
                {courses.map((course) => (
                  <StudentOfInterestCard
                    key={course._id}
                    item={course}
                    type={type}
                  />
                ))}
              </Card.Group>
            </div>
          )
          : (
            <p>
              Add interests or career goals to see recommendations here. To add interests, click on
              the &quot;Explorer&quot; tab, then select &quot;Interests&quot; or &quot;Career Goals&quot; in the
              dropdown
              menu on that page.
            </p>
          )
        : (opportunities.length > 0)
          ? (
            <div style={cardsStackableStyle}>
              <Card.Group stackable itemsPerRow={2}>
                {opportunities.map((course) => (
                  <StudentOfInterestCard
                    key={course._id}
                    item={course}
                    type={type}
                  />
                ))}
              </Card.Group>
            </div>
          )
          : (
            <p>
              Add interests or career goals to see recommendations here. To add interests, click on
              the &quot;Explorer&quot; tab, then select &quot;Interests&quot; or &quot;Career Goals&quot; in the
              dropdown
              menu on that page.
            </p>
          )}
    </Segment>
  );
};

const StudentOfInterestWidgetCont = withTracker(({ match }) => {
  const username = getUsername(match);
  const profile = Users.getProfile(username);
  const userID = Users.getID(username);
  const nonRetiredCourses = Courses.findNonRetired({});
  const nonRetiredOpportunities = Opportunities.findNonRetired({});

  const favoritedInterests: IFavoriteInterest[] = FavoriteInterests.findNonRetired({ userID: userID });
  const favoritedCareerGoals: IFavoriteCareerGoal[] = FavoriteCareerGoals.findNonRetired({ userID: userID });

  return {
    profile,
    nonRetiredCourses,
    nonRetiredOpportunities,
    favoritedInterests,
    favoritedCareerGoals,
  };
})(StudentOfInterestWidget);
const StudentOfInterestWidgetContainer = withRouter(StudentOfInterestWidgetCont);

export default StudentOfInterestWidgetContainer;
