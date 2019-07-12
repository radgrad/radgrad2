import * as React from 'react';
import { List } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import * as _ from 'lodash';
import { getUserIdFromRoute, buildRouteName } from '../shared/RouterHelperFunctions';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { IAcademicTerm, ICourseInstance, IOpportunityInstance, IAcademicYear, Ice, } from '../../../typings/radgrad'; // eslint-disable-line
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../api/course/CourseCollection';

interface IStudentIceColumnVerifiedProps {
  type: 'Innovation' | 'Competency' | 'Experience';
  earnedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
  icePoints: (ice: Ice) => number;
  getCourseSlug: (course) => string;
  getOpportunitySlug: (opportunity) => string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class StudentIceColumnVerified extends React.Component<IStudentIceColumnVerifiedProps> {
  constructor(props) {
    super(props);
  }

  private getUserIdFromRoute = (): string => getUserIdFromRoute(this.props.match);

  private years = (): IAcademicYear[] => {
    const studentID = this.getUserIdFromRoute();
    const ay = AcademicYearInstances.findNonRetired({ studentID }, { sort: { year: 1 } });
    return ay;
  }

  private academicTerms = (year: IAcademicYear): IAcademicTerm[] => {
    const yearTerms = [];
    const termIDs = year.termIDs;
    _.forEach(termIDs, (termID) => {
      yearTerms.push(AcademicTerms.findDoc(termID));
    });
    return yearTerms;
  }

  private hasEvents = (earned: boolean, term: IAcademicTerm): boolean => {
    let ret = false;
    if ((this.getEventsHelper(this.props.type, 'course', earned, term).length > 0) ||
      (this.getEventsHelper(this.props.type, 'opportunity', earned, term).length > 0)) {
      ret = true;
    }
    return ret;
  }

  private getEventsHelper = (iceType: string, type: string, earned: boolean, term: IAcademicTerm): (IOpportunityInstance | ICourseInstance)[] => {
    if (this.getUserIdFromRoute()) {
      let allInstances = [];
      const iceInstances = [];
      if (type === 'course') {
        const courseInstances = CourseInstances.findNonRetired({
          termID: term._id,
          studentID: this.getUserIdFromRoute(),
          verified: earned,
        });
        courseInstances.forEach(courseInstance => allInstances.push(courseInstance));
      } else {
        allInstances = OpportunityInstances.findNonRetired({
          termID: term._id,
          studentID: this.getUserIdFromRoute(),
          verified: earned,
        });
      }
      allInstances.forEach((instance) => {
        if (iceType === 'Innovation') {
          if (instance.ice.i > 0) {
            iceInstances.push(instance);
          }
        } else if (iceType === 'Competency') {
          if (instance.ice.c > 0) {
            iceInstances.push(instance);
          }
        } else if (iceType === 'Experience') {
          if (instance.ice.e > 0) {
            iceInstances.push(instance);
          }
        }
      });
      return iceInstances;
    }
    return null;
  }

  private printTerm = (term: IAcademicTerm): string => AcademicTerms.toString(term._id, false);

  private getEvents = (type: string, earned: boolean, term: IAcademicTerm): (IOpportunityInstance | ICourseInstance)[] => this.getEventsHelper(this.props.type, type, earned, term);

  private opportunityName = (opportunityInstance: IOpportunityInstance): string => {
    const opportunity = Opportunities.findDoc(opportunityInstance.opportunityID);
    return opportunity.name;
  }

  private courseName = (courseInstance: ICourseInstance): string => {
    const course = Courses.findDoc(courseInstance.courseID);
    return course.shortName;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { type, earnedICEPoints, matchingPoints, getCourseSlug, getOpportunitySlug, icePoints, match } = this.props;
    const years = this.years();
    return (
      <React.Fragment>
        {matchingPoints(earnedICEPoints, 0) ?
          <p>You have no verified {type} points.</p>
          :
          <React.Fragment>
            <p>You have {earnedICEPoints} verified {type} points for the following:</p>
            <List relaxed="very">
              {years.map((year) => {
                const academicTerms = this.academicTerms(year);
                return (
                  academicTerms.map((term, index) => {
                    const opportunityEvents = this.getEvents('opportunity', true, term);
                    const courseEvents = this.getEvents('course', true, term);
                    return (
                      <React.Fragment key={index}>
                        {this.hasEvents(true, term) ?
                          <List.Item>
                            <List.Header>{this.printTerm(term)}</List.Header>
                            {opportunityEvents.map((event) => {
                              const opportunitySlug = getOpportunitySlug(event as IOpportunityInstance);
                              const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${opportunitySlug}`);
                              const points = icePoints(event.ice);
                              const opportunityName = this.opportunityName(event as IOpportunityInstance);
                              return (
                                <Link key={`${opportunitySlug}-${route}-${points}-${opportunityName}`}
                                      to={route}><b>+{points}</b> {opportunityName}<br/></Link>
                              );
                            })}
                            {courseEvents.map((event) => {
                              const courseSlug = getCourseSlug(event);
                              const route = buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${courseSlug}`);
                              const points = icePoints(event.ice);
                              const courseName = this.courseName(event as ICourseInstance);
                              return (
                                <Link key={`${courseSlug}-${route}-${points}-${courseName}`}
                                      to={route}><b>+{points}</b> {courseName}<br/></Link>
                              );
                            })}
                          </List.Item> : ''}
                      </React.Fragment>
                    );
                  })
                );
              })}
            </List>
          </React.Fragment>}
      </React.Fragment>
    );
  }
}

export default withRouter(StudentIceColumnVerified);
