import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicPlan, ICourse, ICourseInstance } from '../../../typings/radgrad'; // eslint-disable-line
import AcademicPlanYearView from './AcademicPlanYearView';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { passedCourse } from '../../../api/degree-plan/AcademicPlanUtilities';
import { Slugs } from '../../../api/slug/SlugCollection';

interface IAcademicPlanStaticViewerProps {
  plan: IAcademicPlan;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  takenSlugs: string[];
}

class AcademicPlanStaticViewer extends React.Component<IAcademicPlanStaticViewerProps> {
  constructor(props) {
    super(props);
  }

  private years = (): string[] => {
    const plan = this.props.plan;
    if (plan.coursesPerAcademicTerm.length === 15) {
      return ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
    }
    return ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
  }

  private hasSummer = (yearNum: number): boolean => {
    const plan = this.props.plan;
    const numCoursesList = plan.coursesPerAcademicTerm.slice(0);
    return numCoursesList[(3 * yearNum) + 2] !== 0;
  }

  private courses = (yearNumber: number, termNumber: number): ICourse[] => {
    const ret = [];
    const totalSem = (3 * yearNumber) + termNumber;
    const plan = this.props.plan;
    const numCoursesList = plan.coursesPerAcademicTerm.slice(0);
    const numCourses = numCoursesList[totalSem];
    const courseList = plan.courseList.slice(0);
    let i = 0;
    for (i = 0; i < totalSem; i += 1) {
      courseList.splice(0, numCoursesList[i]);
    }
    for (i = 0; i < numCourses; i += 1) {
      const course = courseList.splice(0, 1);
      ret.push(course[0]);
    }
    return ret;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    // TODO: Test to make sure the important is being set
    const paddedContainerStyle = { marginBottom: '0 !important' };
    const equalWidthGridStyle = { margin: 0 };

    const { plan } = this.props;
    const fiveYear = (this.props.plan.coursesPerAcademicTerm.length % 5) === 0;
    let yearNumber = 0;
    const littlePadding = {
      paddingLeft: 2,
      paddingRight: 2,
    };
    const username = this.props.match.params.username;

    return (
      <div className="ui padded container" style={paddedContainerStyle}>
        <Grid stackable={true}>
          <Grid.Column>
            <Grid columns="equal" style={equalWidthGridStyle}>
              <Grid.Row columns={fiveYear ? 5 : 4}>
                <Grid.Column style={littlePadding}>
                  <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} username={username}
                                        takenSlugs={this.props.takenSlugs}/>
                </Grid.Column>
                <Grid.Column style={littlePadding}>
                  <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} username={username}

                                        takenSlugs={this.props.takenSlugs}/>
                </Grid.Column>
                <Grid.Column style={littlePadding}>
                  <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} username={username}

                                        takenSlugs={this.props.takenSlugs}/>
                </Grid.Column>
                <Grid.Column style={littlePadding}>
                  <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} username={username}

                                        takenSlugs={this.props.takenSlugs}/>
                </Grid.Column>
                {fiveYear ? (
                  <Grid.Column style={littlePadding}>
                    <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={plan} username={username}
                                          takenSlugs={this.props.takenSlugs}/>
                  </Grid.Column>
                ) : ''}
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

function takenSlugs(courseInstances: ICourseInstance[]): ICourseInstance {
  const passedCourseInstances = _.filter(courseInstances, (ci) => passedCourse(ci));
  // console.log(courseInstances, passedCourseInstances);
  return _.map(passedCourseInstances, (ci) => {
    const doc = CourseInstances.getCourseDoc(ci._id);
    return Slugs.getNameFromID(doc.slugID);
  });
}

const AcademicPlanStaticViewerContainer = withTracker((props) => {
  const profile = Users.findProfileFromUsername(props.match.params.username);
  const courseInstances = CourseInstances.find({ studentID: profile.userID }).fetch();
  return {
    takenSlugs: takenSlugs(courseInstances),
    ...props,
  };
})(AcademicPlanStaticViewer);

export default withRouter(AcademicPlanStaticViewerContainer);
