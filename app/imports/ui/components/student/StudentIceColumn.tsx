import * as React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as Router from '../shared/RouterHelperFunctions';
import StudentIceColumnVerified from './StudentIceColumnVerified';
import StudentIceColumnUnverified from './StudentIceColumnUnverified';
import StudentIceColumnRecommended from './StudentIceColumnRecommended';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Ice, IRadGradMatch } from '../../../typings/radgrad'; // eslint-disable-line

interface IStudentIceColumnProps {
  match: IRadGradMatch;
  type: 'Innovation' | 'Competency' | 'Experience';
}

interface IStudentIceColumnState {
  verifiedColumnOpen: boolean;
  unVerifiedColumnOpen: boolean;
  recommendedColumnOpen: boolean;
}

class StudentIceColumn extends React.Component<IStudentIceColumnProps, IStudentIceColumnState> {
  constructor(props) {
    super(props);
    this.state = {
      verifiedColumnOpen: true,
      unVerifiedColumnOpen: false,
      recommendedColumnOpen: false,
    };
  }

  private handleVerifiedColumnClick = (e): void => {
    e.preventDefault();
    this.setState((prevState) => ({ verifiedColumnOpen: !prevState.verifiedColumnOpen }));
  }

  private handleUnVerifiedColumnClick = (e): void => {
    e.preventDefault();
    this.setState((prevState) => ({ unVerifiedColumnOpen: !prevState.unVerifiedColumnOpen }));
  }

  private handleRecommendedColumnClick = (e): void => {
    e.preventDefault();
    this.setState((prevState) => ({ recommendedColumnOpen: !prevState.recommendedColumnOpen }));
  }

  private getVerifiedColor = (): string => {
    const { type } = this.props;
    switch (type) {
      case 'Innovation':
        return 'ice-innovation-color';
      case 'Competency':
        return 'ice-competency-color';
      case 'Experience':
        return 'ice-experience-color';
      default:
        return '';
    }
  }

  private getUnverifiedColor = (): string => {
    const { type } = this.props;
    switch (type) {
      case 'Innovation':
        return 'ice-innovation-proj-color';
      case 'Competency':
        return 'ice-competency-proj-color';
      case 'Experience':
        return 'ice-experience-proj-color';
      default:
        return '';
    }
  }

  private getPoints = (ice: Ice): number => {
    const { type } = this.props;
    let ret;
    if (type === 'Innovation') {
      ret = ice.i;
    } else if (type === 'Competency') {
      ret = ice.c;
    } else if (type === 'Experience') {
      ret = ice.e;
    }
    return ret;
  }

  private remainingICEPoints = (earned: number, projected: number): number => projected - earned;

  private matchingPoints = (a: number, b: number): boolean => a <= b;

  private icePoints = (ice: Ice): number => {
    let ret;
    const { type } = this.props;
    if (type === 'Innovation') {
      ret = ice.i;
    } else if (type === 'Competency') {
      ret = ice.c;
    } else if (type === 'Experience') {
      ret = ice.e;
    }
    return ret;
  }

  private getCourseSlug = (course) => {
    if (course.courseID) {
      return Slugs.findDoc(Courses.findDoc(course.courseID).slugID).name;
    }
    return Slugs.findDoc(course.slugID).name;
  }

  private getOpportunitySlug = (opportunity): string => {
    if (opportunity.opportunityID) {
      return Slugs.findDoc(Opportunities.findDoc(opportunity.opportunityID).slugID).name;
    }
    return Slugs.findDoc(opportunity.slugID).name;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { verifiedColumnOpen, unVerifiedColumnOpen, recommendedColumnOpen } = this.state;
    const { type } = this.props;
    const verifiedColor = this.getVerifiedColor();
    const unverifiedColor = this.getUnverifiedColor();

    const username = Router.getUsername(this.props.match);
    const earnedICE = StudentProfiles.getEarnedICE(username);
    const projectedICE = StudentProfiles.getProjectedICE(username);
    const earnedICEPoints = this.getPoints(earnedICE);
    const projectedICEPoints = this.getPoints(projectedICE);
    const unverifiedICEPoints = this.remainingICEPoints(earnedICEPoints, projectedICEPoints);

    return (
      <Accordion styled={true} fluid={true} exclusive={false}>
        <Accordion.Title active={verifiedColumnOpen} onClick={this.handleVerifiedColumnClick}>
          <Icon name="dropdown"/>Verified <div
          className={`ui right floated ${verifiedColor}`}>{earnedICEPoints} pts</div>
        </Accordion.Title>
        <Accordion.Content active={verifiedColumnOpen}>
          <StudentIceColumnVerified type={type} earnedICEPoints={earnedICEPoints} getCourseSlug={this.getCourseSlug}
                                    matchingPoints={this.matchingPoints} getOpportunitySlug={this.getOpportunitySlug}
                                    icePoints={this.icePoints}/>
        </Accordion.Content>

        <Accordion.Title active={unVerifiedColumnOpen} onClick={this.handleUnVerifiedColumnClick}>
          <Icon name="dropdown"/>Unverified <div
          className={`ui right floated ${unverifiedColor}`}>{unverifiedICEPoints} pts</div>
        </Accordion.Title>
        <Accordion.Content active={unVerifiedColumnOpen}>
          <StudentIceColumnUnverified type={type} earnedICEPoints={earnedICEPoints} icePoints={this.icePoints}
                                      projectedICEPoints={projectedICEPoints} getCourseSlug={this.getCourseSlug}
                                      matchingPoints={this.matchingPoints} getOpportunitySlug={this.getOpportunitySlug}
                                      remainingICEPoints={this.remainingICEPoints}/>
        </Accordion.Content>

        <Accordion.Title active={recommendedColumnOpen} onClick={this.handleRecommendedColumnClick}>
          <Icon name="dropdown"/>Get to 100
        </Accordion.Title>
        <Accordion.Content active={recommendedColumnOpen}>
          <StudentIceColumnRecommended type={type} earnedICEPoints={earnedICEPoints} getCourseSlug={this.getCourseSlug}
                                       projectedICEPoints={projectedICEPoints} matchingPoints={this.matchingPoints}
                                       icePoints={this.icePoints} getOpportunitySlug={this.getOpportunitySlug}/>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default withRouter(StudentIceColumn);
