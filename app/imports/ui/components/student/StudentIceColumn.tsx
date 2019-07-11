import * as React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as Router from '../shared/RouterHelperFunctions';
import StudentIceColumnVerified from './StudentIceColumnVerified';
import StudentIceColumnUnverified from './StudentIceColumnUnverified';
import StudentIceColumnRecommended from './StudentIceColumnRecommended';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Ice } from '../../../typings/radgrad'; // eslint-disable-line

interface IStudentIceColumnProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      opportunity: string;
    }
  };
  type: 'Innovation' | 'Competency' | 'Experience';
}

interface IStudentIceColumnState {
  activeIndex: number;
}

class StudentIceColumn extends React.Component<IStudentIceColumnProps, IStudentIceColumnState> {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }

  private getUsername = (): string => Router.getUsername(this.props.match);

  private getUserIdFromRoute = (): string => Router.getUserIdFromRoute(this.props.match);

  public handleClick = (e, props): void => {
    e.preventDefault();
    const { index } = props;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
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

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { activeIndex } = this.state;
    const { type } = this.props;
    const verifiedColor = this.getVerifiedColor();
    const unverifiedColor = this.getUnverifiedColor();

    const username = this.getUsername();
    const earnedICE = StudentProfiles.getEarnedICE(username);
    const projectedICE = StudentProfiles.getProjectedICE(username);
    const earnedICEPoints = this.getPoints(earnedICE);
    const projectedICEPoints = this.getPoints(projectedICE);
    const unverifiedICEPoints = this.remainingICEPoints(earnedICEPoints, projectedICEPoints);

    return (
      <Accordion styled={true} fluid={true} exclusive={false}>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
          <Icon name="dropdown"/>Verified <div
          className={`ui right floated ${verifiedColor}`}>{earnedICEPoints} pts</div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <StudentIceColumnVerified type={type} earnedICEPoints={earnedICEPoints} matchingPoints={this.matchingPoints}/>
        </Accordion.Content>

        <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
          <Icon name="dropdown"/>Unverified <div
          className={`ui right floated ${unverifiedColor}`}>{unverifiedICEPoints} pts</div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <StudentIceColumnUnverified type={type} projectedICEPoints={projectedICEPoints}
                                      matchingPoints={this.matchingPoints}/>
        </Accordion.Content>

        <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
          <Icon name="dropdown"/>Get to 100
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <StudentIceColumnRecommended type={type} earnedICEPoints={earnedICEPoints}
                                       projectedICEPoints={projectedICEPoints} matchingPoints={this.matchingPoints}/>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default withRouter(StudentIceColumn);
