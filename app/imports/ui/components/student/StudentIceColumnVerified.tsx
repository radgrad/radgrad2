import * as React from 'react';
import { List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { getUserIdFromRoute, buildRouteName } from '../shared/RouterHelperFunctions';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import {
  IAcademicYear,
  IAcademicTerm,
  IOpportunityInstance,
  ICourseInstance,
  IOpportunity,
} from '../../../typings/radgrad';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../api/user/UserCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

interface IStudentIceColumnVerifiedProps {
  type: 'Innovation' | 'Competency' | 'Experience';
  earnedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
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

  private getEventsHelper = (iceType: string, type: string, earned: boolean, term: IAcademicTerm): IOpportunityInstance[] | ICourseInstance[] => {
    if (this.getUserIdFromRoute()) {
      let allInstances = [];
      console.log(this.getUserIdFromRoute());
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
      console.log('term %o', term);
      console.log('allInstances %o', allInstances);
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
      console.log('iceInstances %o', iceInstances);
      return iceInstances;
    }
    return null;
  }

  private printTerm = (term: IAcademicTerm): string => AcademicTerms.toString(term._id, false);

  private getEvents = (type: string, earned: boolean, term: IAcademicTerm): IOpportunityInstance[] | ICourseInstance[] => this.getEventsHelper(this.props.type, type, earned, term);

  private opportunitySlug = (opportunity): string => {
    if (opportunity.opportunityID) {
      return Slugs.findDoc(Opportunities.findDoc(opportunity.opportunityID).slugID).name;
    }
    throw new Error('Invalid opportunity ID from opportunitySlug() in StudentIceColumnVerified.tsx');
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { type, earnedICEPoints, matchingPoints, match } = this.props;
    const years = this.years();
    return (
      <React.Fragment>
        {
          matchingPoints(earnedICEPoints, 0) ?
            <p>You have no verified {type} points.</p>
            :
            <React.Fragment>
              <p>You have {earnedICEPoints} verified {type} points for the following:</p>
              <List relaxed="very">
                {years.map((year) => {
                  const academicTerms = this.academicTerms(year);
                  return (
                    academicTerms.map((term) => {
                      const events = this.getEvents('opportunity', true, term);
                      console.log('events %o', events);
                      return (
                        <React.Fragment key={year._id}>
                          {this.hasEvents(true, term) && <List.Item>
                            <List.Header>{this.printTerm(term)}</List.Header>
                            {/*{events.map((event) => {*/}
                            {/*  const opportunitySlug = this.opportunitySlug(event);*/}
                            {/*  return (*/}

                            {/*  );*/}
                            {/*})}*/}
                          </List.Item>
                          }
                        </React.Fragment>
                      );
                    })
                  );
                })}
              </List>
            </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default withRouter(StudentIceColumnVerified);
