import * as React from 'react';
import { Card, Header, Segment } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import WidgetHeaderNumber from '../shared/WidgetHeaderNumber';
import StudentOfInterestCard from './StudentOfInterestCard';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from '../shared/RouterHelperFunctions';
import { recommendedCourses, recommendedOpportunities } from './student-widget-names';
import { ICourse, IOpportunity, IRadGradMatch } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars

interface IStudentOfInterestWidgetProps {
  type: string;
  match: IRadGradMatch;
  profile: any;
  nonRetiredCourses: ICourse[];
  nonRetiredOpportunities: IOpportunity[];
  hiddenCourses: boolean;
  hiddenOpportunities: boolean;
  dispatch: any;
  courseInstances: any[];
  opportunityInstances: any[];
}

const mapStateToProps = (state) => ({
  hiddenCourses: state.student.home.hiddenCourses,
  hiddenOpportunities: state.student.home.hiddenOpportunities,
});

const isTypeCourse = (props: IStudentOfInterestWidgetProps): boolean => props.type === EXPLORER_TYPE.COURSES;

const isCoursesHidden = (props: IStudentOfInterestWidgetProps): boolean => props.hiddenCourses;

const isOpportunitiesHidden = (props: IStudentOfInterestWidgetProps): boolean => props.hiddenOpportunities;

const availableCourses = (props: IStudentOfInterestWidgetProps) => {
  const { nonRetiredCourses } = props;
  if (nonRetiredCourses.length > 0) {
    const filtered = _.filter(nonRetiredCourses, (course: any) => {
      if (course.num === 'ICS 499') { // TODO: hardcoded ICS string
        return true;
      }
      const ci = CourseInstances.find({
        studentID: Router.getUserIdFromRoute(props.match),
        courseID: course._id,
      }).fetch();
      return ci.length === 0;
    });
    return filtered;
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

const hiddenCoursesHelper = (props: IStudentOfInterestWidgetProps) => {
  if (Router.getUsername(props.match)) {
    const courses = matchingCourses(props);
    let nonHiddenCourses;
    if (isCoursesHidden(props)) {
      const { profile } = props;
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
};

const availableOpps = (props: IStudentOfInterestWidgetProps) => {
  const { nonRetiredOpportunities } = props;
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  if (nonRetiredOpportunities.length > 0) {
    const filteredByTerm = _.filter(nonRetiredOpportunities, (opp: any) => {
      const oi = OpportunityInstances.find({
        studentID: Router.getUserIdFromRoute(props.match),
        opportunityID: opp._id,
      }).fetch();
      return oi.length === 0;
    });
    const ret = _.filter(filteredByTerm, (opp) => {
      let inFuture = false;
      _.forEach(opp.termIDs, (termID) => {
        const term = AcademicTerms.findDoc(termID);
        if (term.termNumber >= currentTerm.termNumber) {
          inFuture = true;
        }
      });
      return inFuture;
    });
    return ret;
  }
  return [];
};

const matchingOpportunities = (props: IStudentOfInterestWidgetProps) => {
  const allOpportunities = availableOpps(props);
  const matching: any = [];
  const { profile } = props;
  const userInterests = [];
  let opportunityInterests = [];
  _.forEach(Users.getInterestIDs(profile.userID), (id) => {
    userInterests.push(Interests.findDoc(id));
  });
  _.forEach(allOpportunities, (opp) => {
    opportunityInterests = [];
    _.forEach(opp.interestIDs, (id) => {
      opportunityInterests.push(Interests.findDoc(id));
      _.forEach(opportunityInterests, (oppInterest) => {
        _.forEach(userInterests, (userInterest) => {
          if (_.isEqual(oppInterest, userInterest)) {
            if (!_.includes(matching, opp)) {
              matching.push(opp);
            }
          }
        });
      });
    });
  });
  // Only display up to the first six matches.
  return (matching < 7) ? matching : matching.slice(0, 6);
};

const hiddenOpportunitiesHelper = (props: IStudentOfInterestWidgetProps) => {
  if (Router.getUsername(props.match)) {
    const opportunities = matchingOpportunities(props);
    let nonHiddenOpportunities;
    if (isOpportunitiesHidden(props)) {
      const { profile } = props;
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
};

const itemCount = (props: IStudentOfInterestWidgetProps) => {
  let ret;
  if (isTypeCourse(props)) {
    ret = hiddenCoursesHelper(props).length;
  } else {
    ret = hiddenOpportunitiesHelper(props).length;
  }
  return ret;
};

const courses = (props: IStudentOfInterestWidgetProps) => {
  const cs = matchingCourses(props);
  let visibleCourses;
  if (isCoursesHidden(props)) {
    visibleCourses = hiddenCoursesHelper(props);
  } else {
    visibleCourses = cs;
  }
  return visibleCourses;
};

const opportunities = (props: IStudentOfInterestWidgetProps) => {
  const os = matchingOpportunities(props);
  let visibleOpportunities;
  if (isOpportunitiesHidden(props)) {
    visibleOpportunities = hiddenOpportunitiesHelper(props);
  } else {
    visibleOpportunities = os;
  }
  return visibleOpportunities;
};


const StudentOfInterestWidget = (props: IStudentOfInterestWidgetProps) => {
  /*
   Had to declare the styles as React.CSSProperties to fix the "Type X is not assignable to Type Y" errors
   See https://github.com/microsoft/TypeScript/issues/11465#issuecomment-252453037
   */
  const uppercaseTextTransformStyle: React.CSSProperties = { textTransform: 'uppercase' };
  const cardsStackableStyle: React.CSSProperties = {
    maxHeight: '500px',
    overflowX: 'hidden',
    overflowY: 'scroll',
    marginTop: '10px',
  };

  const { type } = props;
  let id = '';
  if (type === 'opportunities') {
    id = recommendedOpportunities;
  } else {
    id = recommendedCourses;
  }
  return (
    <Segment padded={true} id={id}>
      {/* Don't know why this particular <Header> is not accepting a boolean value of true for dividing, it's
        complaining that I should use the string "true" instead. Even then, the dividing line doesn't even appear. So I
        had to use the className attribute instead so it renders as "ui dividing header". - Gian */}
      <Header className="dividing">
        <h4>
          RECOMMENDED <span style={uppercaseTextTransformStyle}>{type}</span> <WidgetHeaderNumber
          inputValue={itemCount(props)}/>
        </h4>
      </Header>

      {
        courses ?
          <div style={cardsStackableStyle}>
            <Card.Group stackable={true} itemsPerRow={2}>
              {
                isTypeCourse(props) ?
                  courses(props).map((course, index) => <StudentOfInterestCard key={index}
                                                                               item={course}
                                                                               type={type}/>)
                  :
                  opportunities(props).map((opp, index) => <StudentOfInterestCard key={index}
                                                                                  item={opp}
                                                                                  type={type}/>)
              }
            </Card.Group>
          </div>
          :
          <p>Add interests to see recommendations here. To add interests, click on
            the &quot;Explorer&quot; tab,
            then select &quot;Interests&quot; in the pull-down menu on that page.</p>
      }
    </Segment>
  );
};

const StudentOfInterestWidgetCon = connect(mapStateToProps)(StudentOfInterestWidget);
const StudentOfInterestWidgetCont = withTracker(({ match }) => {
  /* Reactive sources to make Hiding a Course / Opportunity reactive */
  const username = match.params.username;
  const profile = Users.getProfile(username);
  const nonRetiredCourses = Courses.findNonRetired();
  const nonRetiredOpportunities = Opportunities.findNonRetired();

  /* Reactive sources to make StudentOfInterestAdd reactive */
  const courseInstances = CourseInstances.findNonRetired();
  const opportunityInstances = OpportunityInstances.findNonRetired();

  return {
    profile,
    nonRetiredCourses,
    nonRetiredOpportunities,
    courseInstances,
    opportunityInstances,
  };
})(StudentOfInterestWidgetCon);
const StudentOfInterestWidgetContainer = withRouter(StudentOfInterestWidgetCont);

export default StudentOfInterestWidgetContainer;
