import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicPlan, ICourseInstance } from '../../../typings/radgrad'; // eslint-disable-line
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { passedCourse } from '../../../api/degree-plan/AcademicPlanUtilities';
import { Slugs } from '../../../api/slug/SlugCollection';
import AcademicPlanStaticYearView from './AcademicPlanStaticYearView';

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

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
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
      <div className="ui padded container">
        <Grid stackable={true}>
          <Grid.Column>
            <Grid columns="equal" style={equalWidthGridStyle}>
              <Grid.Row columns={fiveYear ? 5 : 4}>
                <Grid.Column style={littlePadding}>
                  <AcademicPlanStaticYearView yearNumber={yearNumber++} academicPlan={plan}
                                              username={username}
                                              takenSlugs={this.props.takenSlugs}/>
                </Grid.Column>
                <Grid.Column style={littlePadding}>
                  <AcademicPlanStaticYearView yearNumber={yearNumber++} academicPlan={plan}
                                              username={username}

                                              takenSlugs={this.props.takenSlugs}/>
                </Grid.Column>
                <Grid.Column style={littlePadding}>
                  <AcademicPlanStaticYearView yearNumber={yearNumber++} academicPlan={plan}
                                              username={username}

                                              takenSlugs={this.props.takenSlugs}/>
                </Grid.Column>
                <Grid.Column style={littlePadding}>
                  <AcademicPlanStaticYearView yearNumber={yearNumber++} academicPlan={plan}
                                              username={username}

                                              takenSlugs={this.props.takenSlugs}/>
                </Grid.Column>
                {fiveYear ? (
                  <Grid.Column style={littlePadding}>
                    <AcademicPlanStaticYearView yearNumber={yearNumber++} academicPlan={plan}
                                                username={username}
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
