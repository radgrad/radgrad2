import * as React from 'react';
import { Grid, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicPlan } from '../../../typings/radgrad';
import AcademicPlanYearView from '../shared/AcademicPlanYearView';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

interface IAcademicPlanViewerWidgetProps {
  academicPlan: IAcademicPlan;
  username: string;
  takenSlugs: string[];
}

class AcademicPlanViewerWidget extends React.Component<IAcademicPlanViewerWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const quarter = this.props.academicPlan.coursesPerAcademicTerm.length % 4 === 0;
    const fiveYear = this.props.academicPlan.coursesPerAcademicTerm.length % 5 === 0;
    let yearNumber = 0;
    const littlePadding = {
      paddingLeft: 2,
      paddingRight: 2,
    };
    return (
      <Grid>
        <Grid.Row>
          <Label>{quarter ? 'Quarter' : 'Semester'} {fiveYear ? 'BAM' : 'Bachelors'}</Label>
        </Grid.Row>
        <Grid.Row columns={fiveYear ? 5 : 4}>
          <Grid.Column style={littlePadding}>
            <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={this.props.academicPlan}
                                  username={this.props.username}/>
          </Grid.Column>
          <Grid.Column style={littlePadding}>
            <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={this.props.academicPlan}
                                  username={this.props.username}/>
          </Grid.Column>
          <Grid.Column style={littlePadding}>
            <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={this.props.academicPlan}
                                  username={this.props.username}/>
          </Grid.Column>
          <Grid.Column style={littlePadding}>
            <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={this.props.academicPlan}
                                  username={this.props.username}/>
          </Grid.Column>
          {fiveYear ? (
            <Grid.Column style={littlePadding}>
              <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={this.props.academicPlan}
                                    username={this.props.username}/>
            </Grid.Column>
          ) : ''}
        </Grid.Row>
      </Grid>
    );
  }
}

function takenSlugs(courseInstances) {
  return _.map(courseInstances, (ci) => {
    const doc = CourseInstances.getCourseDoc(ci._id);
    return Slugs.getNameFromID(doc.slugID);
  });
}

const AcademicPlanViewerWidgetContainer = withTracker((props) => {
  const courseInstances = CourseInstances.find({ studentID: props.studentID }).fetch();
  return {
    takenSlugs: takenSlugs(courseInstances),
    ...props,
  };
})(AcademicPlanViewerWidget);
export default AcademicPlanViewerWidgetContainer;
